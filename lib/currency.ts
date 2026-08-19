'use client';

import { useSyncExternalStore } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'JPY' | 'CAD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Multiplier against base USD
  format: (amountUSD: number) => string;
  gatewayNote: string;
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    rate: 1,
    label: 'USD ($)',
    format: (amountUSD: number) => `$${Math.round(amountUSD).toLocaleString()} USD`,
    gatewayNote: 'Processed via Global Private Settlement (Stripe / International Cards)',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rate: 0.92,
    label: 'EUR (€)',
    format: (amountUSD: number) => `€${Math.round(amountUSD * 0.92).toLocaleString()} EUR`,
    gatewayNote: 'Processed in Eurozone SEPA / Private European Card Rail',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rate: 0.79,
    label: 'GBP (£)',
    format: (amountUSD: number) => `£${Math.round(amountUSD * 0.79).toLocaleString()} GBP`,
    gatewayNote: 'Processed in Sterling / UK Private Banking Settlement',
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    rate: 1550,
    label: 'NGN (₦)',
    format: (amountUSD: number) => `₦${Math.round(amountUSD * 1550).toLocaleString()} NGN`,
    gatewayNote: 'Processed via Direct Bank Transfer & Paystack Local Gateway (Zero Card Friction)',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    rate: 155,
    label: 'JPY (¥)',
    format: (amountUSD: number) => `¥${Math.round(amountUSD * 155).toLocaleString()} JPY`,
    gatewayNote: 'Processed via Japanese Private Card Rail & Tokyo Salon Settlement',
  },
  CAD: {
    code: 'CAD',
    symbol: '$',
    rate: 1.36,
    label: 'CAD ($)',
    format: (amountUSD: number) => `$${Math.round(amountUSD * 1.36).toLocaleString()} CAD`,
    gatewayNote: 'Processed via Canadian Interac & International Private Card Rail',
  },
};

let currentCurrency: CurrencyCode = 'USD';
const listeners = new Set<() => void>();

function detectLocaleCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'USD';
  try {
    const lang = (navigator.language || '').toLowerCase();
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();

    if (lang.includes('ja') || tz.includes('tokyo')) return 'JPY';
    if (lang.includes('gb') || tz.includes('london')) return 'GBP';
    if (lang.includes('ca') || tz.includes('toronto') || tz.includes('vancouver')) return 'CAD';
    if (lang.includes('ng') || tz.includes('lagos')) return 'NGN';
    if (
      lang.includes('fr') ||
      lang.includes('de') ||
      lang.includes('it') ||
      lang.includes('es') ||
      tz.includes('paris') ||
      tz.includes('rome') ||
      tz.includes('berlin') ||
      tz.includes('madrid') ||
      tz.includes('lisbon')
    ) {
      return 'EUR';
    }
  } catch {
    // fallback
  }
  return 'USD';
}

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('metamorphoo_currency') as CurrencyCode;
    if (saved && CURRENCIES[saved]) {
      currentCurrency = saved;
    } else {
      currentCurrency = detectLocaleCurrency();
    }
  } catch {
    // ignore
  }
}

export const currencyStore = {
  getCurrency(): CurrencyCode {
    return currentCurrency;
  },
  setCurrency(c: CurrencyCode) {
    currentCurrency = c;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('metamorphoo_currency', c);
      } catch {
        // ignore
      }
    }
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useCurrency(): CurrencyCode {
  return useSyncExternalStore(
    currencyStore.subscribe,
    () => currencyStore.getCurrency(),
    () => 'USD'
  );
}
