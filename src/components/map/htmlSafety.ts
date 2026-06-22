// Utilities to safely interpolate untrusted data into innerHTML strings
// used by Google Maps marker / InfoWindow content.

export function escapeHtml(input: unknown): string {
  if (input === null || input === undefined) return '';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function safeImageUrl(url: unknown, fallback = '/placeholder.svg'): string {
  if (typeof url !== 'string' || !url) return fallback;
  try {
    const parsed = new URL(url, window.location.origin);
    if (!['http:', 'https:'].includes(parsed.protocol)) return fallback;
    return parsed.toString();
  } catch {
    return fallback;
  }
}

export function safeProfileUrl(prefix: '/instructor/' | '/school/', id: unknown): string {
  // Allow only safe id characters; otherwise return a harmless fallback.
  const raw = String(id ?? '');
  if (!/^[A-Za-z0-9_-]+$/.test(raw)) return '/';
  return `${prefix}${raw}`;
}

export function safeNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
