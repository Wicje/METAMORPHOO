import { CartItem } from './types';
import { CURRENCIES, CurrencyCode } from './currency';

export const CONCIERGE_CONFIG = {
  whatsappNumber: process.env.NEXT_PUBLIC_CONCIERGE_WHATSAPP || '2348123456789',
  displayPhone: '+234 812 345 6789',
  email: process.env.NEXT_PUBLIC_CONCIERGE_EMAIL || 'concierge@metamorphoo.com',
  atelierHours: 'Monday – Saturday · 09:00 – 20:00 (WAT / GMT+1)',
  responsePromise: 'Dedicated Stylist Response within 15 Minutes',
};

export interface AllocationPayload {
  reference: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  notes?: string;
  items: CartItem[];
  currency: CurrencyCode;
  subtotalUSD: number;
  totalUSD: number;
  formattedTotal: string;
  deliveryMethod: 'courier' | 'white_glove';
  timestamp: number;
}

export interface WaitlistPayload {
  id: string;
  email: string;
  name?: string;
  source?: string;
  timestamp: number;
}

/**
 * Builds the WhatsApp message text for a complete wardrobe allocation request
 */
export function buildAllocationManifestText(allocation: AllocationPayload): string {
  const currencyConfig = CURRENCIES[allocation.currency] || CURRENCIES.USD;
  const deliveryLabel =
    allocation.deliveryMethod === 'white_glove'
      ? 'White Glove Atelier Courier (Cedar Garment Case)'
      : 'Complimentary Insured Express Dispatch';

  let itemsList = '';
  allocation.items.forEach((ci, idx) => {
    const formattedItemPrice = currencyConfig.format(ci.item.price * ci.quantity);
    itemsList += `${idx + 1}. ${ci.lookName} — ${ci.item.name}\n   Size: ${ci.selectedSize} | Qty: ${ci.quantity} | Total: ${formattedItemPrice}\n`;
  });

  return (
    `*METAMORPHOO · PRIVATE SARTORIAL ALLOCATION*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Reference:* ${allocation.reference}\n` +
    `*Client:* ${allocation.clientName || 'Private Client'}\n` +
    `*Contact:* ${allocation.clientPhone || 'Not specified'} | ${allocation.clientEmail || 'Not specified'}\n` +
    `*Destination:* ${allocation.clientAddress || 'To be confirmed in chat'}\n` +
    `*Delivery Protocol:* ${deliveryLabel}\n` +
    `*Settlement Currency:* ${allocation.currency}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*REQUESTED PIECES MANIFEST:*\n\n` +
    `${itemsList}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*WARDROBE TOTAL:* ${allocation.formattedTotal}\n` +
    `*Packaging:* Archival Breathable Cotton + Cedar Blocks\n` +
    (allocation.notes ? `*Client Sizing / Notes:* ${allocation.notes}\n` : '') +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `Please verify availability and confirm payment settlement details (Bank Transfer / Private Link).`
  );
}

/**
 * Builds a direct WhatsApp link with pre-filled encoded text
 */
export function getWhatsAppUrl(text: string, customNumber?: string): string {
  const phone = (customNumber || CONCIERGE_CONFIG.whatsappNumber).replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${encodedText}`;
}

/**
 * Builds a WhatsApp URL for general inquiries or piece consultations
 */
export function getGeneralInquiryWhatsAppUrl(subject?: string, pieceTitle?: string): string {
  let message = `Hello Metamorphoo Concierge,\n\nI am contacting the Atelier regarding `;
  if (pieceTitle) {
    message += `the piece: *${pieceTitle}*.\nI would like to inquire about fit, drape measurements, and current allocation availability.`;
  } else if (subject) {
    message += `${subject}.\nCould a stylist assist me with private consultation?`;
  } else {
    message += `a private styling and wardrobe consultation.`;
  }
  return getWhatsAppUrl(message);
}

/**
 * Client-side persistence helpers for allocations and waitlists
 */
export function saveAllocationLocally(allocation: AllocationPayload) {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem('metamorphoo_concierge_allocations') || '[]');
    const updated = [allocation, ...existing.filter((a: AllocationPayload) => a.reference !== allocation.reference)];
    localStorage.setItem('metamorphoo_concierge_allocations', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save allocation to localStorage', e);
  }
}

export function saveWaitlistLocally(waitlist: WaitlistPayload) {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem('metamorphoo_waitlist_records') || '[]');
    const updated = [waitlist, ...existing.filter((w: WaitlistPayload) => w.email !== waitlist.email)];
    localStorage.setItem('metamorphoo_waitlist_records', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save waitlist to localStorage', e);
  }
}

export function getSavedAllocations(): AllocationPayload[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('metamorphoo_concierge_allocations') || '[]');
  } catch {
    return [];
  }
}

export function getSavedWaitlists(): WaitlistPayload[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('metamorphoo_waitlist_records') || '[]');
  } catch {
    return [];
  }
}
