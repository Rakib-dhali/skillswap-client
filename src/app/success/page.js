import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Success({ searchParams }) {
  const params = await searchParams;
  const { session_id, is_dummy } = params;

  if (!session_id) {
    throw new Error("Please provide a valid session_id configuration flag.");
  }

  let customerEmail = "";
  let displayAmount = "0";
  let displayTitle = "Project Task Escrow";

  // Branch behavior: If it originated from your layout form, parse raw URL keys directly
  if (is_dummy === "true") {
    customerEmail = params.client_email || "client@skillswap.network";
    displayAmount = params.amount || "0";
    displayTitle = params.title || "Task Secure Payment";
  } else {
    // Standard secure Live/Test Stripe API verification block
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

    if (session.status === "open") {
      return redirect("/");
    }

    if (session.status === "complete") {
  customerEmail = session.customer_details?.email || "";
  displayAmount = String(session.metadata?.price || "0");
  displayTitle = session.metadata?.title || "Project Milestone";

  const proposalId = session.metadata?.taskId; // proposal id
  const actualTaskId = session.metadata?.actualTaskId; // task id

  try {
    const serverUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

    // 1. Accept proposal
    if (proposalId) {
      await fetch(`${serverUrl}/api/proposals/${proposalId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "accepted",
        }),
      });
    }

    // 2. Move task to In Progress
    if (actualTaskId) {
      await fetch(`${serverUrl}/api/tasks/${actualTaskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "In Progress",
        }),
      });
    }

    // 3. Save payment record
    await fetch(`${serverUrl}/api/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await authClient.token()}`,
      },
      body: JSON.stringify({
        payment: {
          client_email: customerEmail,
          freelancer_email: session.metadata?.freelancerEmail,
          task_id: actualTaskId,
          amount: Number(displayAmount),
          transaction_id: session.payment_intent?.id || session_id,
          payment_status: session.status,
          paid_at: new Date().toISOString(),
        },
      }),
    });
  } catch (err) {
    console.error("Payment sync error:", err);
  }
}
  }

  return (
    <main className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-6 font-sans text-black antialiased">
      <div className="w-full max-w-xl bg-white border border-black p-8 md:p-12 text-center shadow-sm select-none">
        
        {/* Success Branding Checkmark Icon wrapper */}
        <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-black text-2xl mx-auto mb-6">
          ✓
        </div>

        <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-2">
          Payment Captured
        </h1>
        <p className="text-[10px] font-bold tracking-[0.2em] text-green-600 uppercase mb-8">
          Escrow Active & Secure
        </p>

        {/* Invoice specifications metadata summary list view breakdown */}
        <div className="border border-black/10 bg-black/[0.01] p-6 text-left mb-8 space-y-3">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-black/40 uppercase tracking-wider">Project Line</span>
            <span className="font-black text-black truncate max-w-[240px] uppercase">{displayTitle}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="font-bold text-black/40 uppercase tracking-wider">Account Receipt</span>
            <span className="font-medium text-black/70">{customerEmail}</span>
          </div>
          <div className="border-t border-black/10 pt-3 mt-3 flex justify-between items-baseline">
            <span className="text-xs font-black uppercase tracking-wider">Funds Settled</span>
            <span className="text-2xl font-black tracking-tight">${displayAmount}</span>
          </div>
        </div>

        <p className="text-xs font-medium text-black/60 leading-relaxed max-w-md mx-auto mb-10">
          We appreciate your business! A confirmation summary layout sheet has been dispatched to{" "}
          <strong className="text-black font-bold">{customerEmail}</strong>. Freelancer milestone tracking channels are now activated.
        </p>

        {/* Action Blocks buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href="/dashboard"
            className="flex-1 bg-black text-white hover:bg-black/90 font-bold text-xs uppercase tracking-widest py-4 border border-black text-center transition-colors duration-150"
          >
            Go to Dashboard
          </Link>
          <a 
            href="mailto:support@skillswap.network"
            className="flex-1 bg-transparent hover:bg-black/5 text-black font-bold text-xs uppercase tracking-widest py-4 border border-black text-center transition-colors duration-150"
          >
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}