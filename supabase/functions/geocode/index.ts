import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { address, lat, lon } = await req.json();
    const apiKey = Deno.env.get('POSITIONSTACK_API_KEY');

    if (!apiKey) {
      throw new Error('POSITIONSTACK_API_KEY not configured');
    }

    let url: string;

    if (address) {
      // Forward geocoding: address -> coordinates
      url = `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${encodeURIComponent(address)}&limit=5`;
    } else if (lat !== undefined && lon !== undefined) {
      // Reverse geocoding: coordinates -> address
      url = `http://api.positionstack.com/v1/reverse?access_key=${apiKey}&query=${lat},${lon}&limit=1`;
    } else {
      throw new Error('Either address or lat/lon must be provided');
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
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
