import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('POSITIONSTACK_API_KEY');
    if (!apiKey) {
      throw new Error('POSITIONSTACK_API_KEY not configured');
    }

    const body = await req.json().catch(() => ({}));
    const { address, lat, lon } = body ?? {};

    // Input validation
    if (address !== undefined) {
      if (typeof address !== 'string' || address.trim().length === 0 || address.length > 500) {
        return new Response(
          JSON.stringify({ error: 'Invalid address (must be a non-empty string ≤500 chars)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    if (lat !== undefined || lon !== undefined) {
      if (
        typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90 ||
        typeof lon !== 'number' || !Number.isFinite(lon) || lon < -180 || lon > 180
      ) {
        return new Response(
          JSON.stringify({ error: 'Invalid coordinates' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    let url: string;
    if (address) {
      url = `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${encodeURIComponent(address)}&limit=5`;
    } else if (lat !== undefined && lon !== undefined) {
      url = `http://api.positionstack.com/v1/reverse?access_key=${apiKey}&query=${lat},${lon}&limit=1`;
    } else {
      return new Response(
        JSON.stringify({ error: 'Either address or lat/lon must be provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'PositionStack API error');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Geocoding error:', errorMessage);
    return new Response(
      JSON.stringify({ error: 'Geocoding request failed' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
