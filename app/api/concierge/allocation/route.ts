import { NextRequest, NextResponse } from 'next/server';

// Server in-memory ledger store for runtime persistence
interface AllocationRecord {
  id: string;
  reference: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  notes?: string;
  itemsCount: number;
  itemsSummary: string[];
  currency: string;
  subtotalUSD: number;
  totalUSD: number;
  formattedTotal: string;
  deliveryMethod: string;
  timestamp: number;
  status: 'PENDING_CONCIERGE_CONTACT' | 'CONFIRMED' | 'SETTLED' | 'DISPATCHED';
}

const allocationsLedger: AllocationRecord[] = [];

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const record: AllocationRecord = {
      id: `alloc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      reference: data.reference || `MΦ-ALLOC-${Math.floor(100000 + Math.random() * 900000)}`,
      clientName: data.clientName || 'Confidential Client',
      clientPhone: data.clientPhone || '',
      clientEmail: data.clientEmail || '',
      clientAddress: data.clientAddress || '',
      notes: data.notes || '',
      itemsCount: Array.isArray(data.items) ? data.items.length : 0,
      itemsSummary: Array.isArray(data.items)
        ? data.items.map((i: any) => `${i.lookName || ''} - ${i.item?.name || ''} (${i.selectedSize || ''}) x${i.quantity || 1}`)
        : [],
      currency: data.currency || 'USD',
      subtotalUSD: data.subtotalUSD || 0,
      totalUSD: data.totalUSD || 0,
      formattedTotal: data.formattedTotal || '',
      deliveryMethod: data.deliveryMethod || 'courier',
      timestamp: Date.now(),
      status: 'PENDING_CONCIERGE_CONTACT',
    };

    allocationsLedger.unshift(record);

    // Optional Real Email Dispatch via Resend or Mail Webhook if configured
    let emailDispatched = false;
    const resendApiKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NEXT_PUBLIC_CONCIERGE_EMAIL || 'concierge@metamorphoo.com';

    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'METAMORPHOO Concierge <concierge@metamorphoo.com>',
            to: [notifyEmail],
            subject: `NEW ALLOCATION REQUEST — ${record.reference} (${record.clientName})`,
            html: `
              <h2>METAMORPHOO PRIVATE SARTORIAL ALLOCATION</h2>
              <p><strong>Reference:</strong> ${record.reference}</p>
              <p><strong>Client:</strong> ${record.clientName} (${record.clientEmail} | ${record.clientPhone})</p>
              <p><strong>Destination:</strong> ${record.clientAddress}</p>
              <p><strong>Total:</strong> ${record.formattedTotal}</p>
              <h3>Requested Manifest:</h3>
              <ul>${record.itemsSummary.map((item) => `<li>${item}</li>`).join('')}</ul>
              ${record.notes ? `<p><strong>Notes:</strong> ${record.notes}</p>` : ''}
            `,
          }),
        });
        emailDispatched = true;
      } catch (e) {
        console.warn('Failed to send Resend email notification', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Allocation request logged in Atelier registry',
      recordId: record.id,
      reference: record.reference,
      timestamp: record.timestamp,
      emailDispatched,
    });
  } catch (error: any) {
    console.error('Error logging concierge allocation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process allocation request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    totalAllocations: allocationsLedger.length,
    allocations: allocationsLedger,
  });
}
