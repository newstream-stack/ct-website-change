import type { PaymentResourceType } from '../types/payment';

export function toSafeExternalUrl(value: string, baseUrl: string): string {
  const url = new URL(value, baseUrl);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('後端回傳了不安全的導向網址');
  }
  return url.toString();
}

export function getSafeExternalUrl(value: string | undefined, baseUrl = window.location.origin): string | undefined {
  if (!value) return undefined;
  try {
    return toSafeExternalUrl(value, baseUrl);
  } catch {
    return undefined;
  }
}

export function redirectToExternalUrl(value: string): void {
  window.location.assign(toSafeExternalUrl(value, window.location.origin));
}

export function buildPaymentReturnUrl(type: PaymentResourceType): string {
  const url = new URL(window.location.pathname, window.location.origin);
  url.searchParams.set('payment', type);
  return url.toString();
}
