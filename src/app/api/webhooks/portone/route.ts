import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";

/**
 * PortOne V2 Payment Webhook Handler
 * POST /api/webhooks/portone
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 [PortOne V2 Webhook Received]:", JSON.stringify(body, null, 2));

    const { type, data } = body;

    // 1. Check event type (Transaction.Paid, Transaction.Cancelled, etc.)
    if (type === "Transaction.Paid" || type === "Payment.Paid") {
      const paymentId = data?.paymentId || data?.payment_id;
      console.log(`✅ [PortOne Webhook] Payment Successful for ID: ${paymentId}`);

      // Sync payment record to Supabase if needed
      if (paymentId) {
        try {
          await supabaseAdmin.from("payment_logs").upsert({
            payment_id: paymentId,
            status: "PAID",
            raw_payload: body,
            updated_at: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn("Failed to record payment log in DB:", dbErr);
        }
      }
    }

    // Always respond 200 OK to PortOne Webhook within 5s
    return NextResponse.json({ success: true, message: "Webhook processed successfully" }, { status: 200 });
  } catch (err: any) {
    console.error("❌ POST /api/webhooks/portone error:", err);
    // Still return 200 OK so PortOne does not continuously retry on minor format issues
    return NextResponse.json({ success: false, error: err.message }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "PortOne V2 Webhook Endpoint is Active" });
}
