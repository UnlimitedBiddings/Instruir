import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Brazilian bank codes (main banks)
const BANK_CODES: Record<string, string> = {
  '001': 'Banco do Brasil',
  '033': 'Santander',
  '104': 'Caixa Econômica Federal',
  '237': 'Bradesco',
  '341': 'Itaú Unibanco',
  '356': 'Banco Real',
  '389': 'Banco Mercantil do Brasil',
  '399': 'HSBC Bank Brasil',
  '422': 'Banco Safra',
  '453': 'Banco Rural',
  '633': 'Banco Rendimento',
  '652': 'Itaú Unibanco Holding',
  '745': 'Citibank',
  '756': 'Banco Cooperativo do Brasil (Sicoob)',
  '260': 'Nu Pagamentos (Nubank)',
  '077': 'Banco Inter',
  '212': 'Banco Original',
  '336': 'Banco C6',
  '290': 'PagSeguro',
  '323': 'Mercado Pago',
  '380': 'PicPay',
  '197': 'Stone Pagamentos',
};

function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

function validatePixKey(keyType: string, key: string): boolean {
  switch (keyType) {
    case 'cpf':
      return validateCPF(key);
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key);
    case 'phone':
      const cleanPhone = key.replace(/[^\d]/g, '');
      return cleanPhone.length === 11 || cleanPhone.length === 10;
    case 'random':
      // Random key format: 32 characters
      return /^[a-f0-9-]{32,36}$/.test(key.toLowerCase());
    default:
      return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { bank_code, agency, account, account_type, holder_cpf, pix_key_type, pix_key } = body;

    const errors: string[] = [];

    // Validate bank code
    if (!bank_code || !BANK_CODES[bank_code]) {
      if (bank_code && bank_code.length === 3) {
        // Allow unknown bank codes but warn
        console.log(`Unknown bank code: ${bank_code}`);
      } else {
        errors.push('Código do banco inválido');
      }
    }

    // Validate agency (usually 4 digits, sometimes with check digit)
    if (!agency || agency.replace(/[^\d]/g, '').length < 3) {
      errors.push('Agência inválida');
    }

    // Validate account (varies by bank, but usually 5-13 digits)
    const cleanAccount = account?.replace(/[^\d]/g, '') || '';
    if (cleanAccount.length < 4 || cleanAccount.length > 15) {
      errors.push('Número da conta inválido');
    }

    // Validate account type
    if (!['checking', 'savings', 'payment'].includes(account_type)) {
      errors.push('Tipo de conta inválido');
    }

    // Validate holder CPF
    if (holder_cpf && !validateCPF(holder_cpf)) {
      errors.push('CPF do titular inválido');
    }

    // Validate PIX key if provided
    if (pix_key_type && pix_key) {
      if (!validatePixKey(pix_key_type, pix_key)) {
        errors.push('Chave PIX inválida');
      }
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ valid: false, errors }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        valid: true,
        bank_name: BANK_CODES[bank_code] || 'Banco não identificado',
        formatted: {
          agency: agency.replace(/[^\d]/g, '').padStart(4, '0'),
          account: cleanAccount,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error validating bank account:', error);
    return new Response(
      JSON.stringify({ valid: false, error: 'Erro ao validar conta bancária' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
