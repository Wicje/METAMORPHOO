import { NextRequest, NextResponse } from 'next/server';

interface WaitlistRecord {
  id: string;
  email: string;
  name?: string;
  source?: string;
  timestamp: number;
}

const waitlistLedger: WaitlistRecord[] = [];

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = waitlistLedger.find((w) => w.email === normalizedEmail);

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        message: 'Email is already registered in the Originals archive registry',
        id: existing.id,
        timestamp: existing.timestamp,
      });
    }

    const record: WaitlistRecord = {
      id: `ORIGINALS-${Math.floor(1000 + Math.random() * 9000)}`,
      email: normalizedEmail,
      name: data.name || '',
      source: data.source || 'ORIGINALS_CAPSULE_PAGE',
      timestamp: Date.now(),
    };

    waitlistLedger.unshift(record);

    return NextResponse.json({
      success: true,
      alreadyRegistered: false,
      message: 'Successfully registered in the numbered Originals allocation registry',
      id: record.id,
      timestamp: record.timestamp,
    });
  } catch (error: any) {
    console.error('Error logging waitlist entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record waitlist entry' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    totalRegistered: waitlistLedger.length,
    records: waitlistLedger,
  });
}
