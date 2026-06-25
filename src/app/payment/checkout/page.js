"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const proposalId = searchParams.get("proposalId") || "";
  const taskId = searchParams.get("taskId") || "";
  const freelancerEmail = searchParams.get("freelancerEmail") || "";
  const amount = searchParams.get("amount") || "0";
  const title = searchParams.get("title") || "Task Payment";
  const clientEmail = searchParams.get("clientEmail") || "";

  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // 1. Update proposal status to accepted
      const proposalRes = await fetch(
        `${serverUrl}/api/proposals/${proposalId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "accepted" }),
        }
      );
      if (!proposalRes.ok) throw new Error("Failed to accept proposal.");

      // 2. Update task status to In Progress
      const taskRes = await fetch(
        `${serverUrl}/api/tasks/${taskId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "In Progress" }),
        }
      );
      if (!taskRes.ok) throw new Error("Failed to update task status.");

      // 3. Record payment
      const paymentRes = await fetch(`${serverUrl}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment: {
            client_email: clientEmail,
            freelancer_email: freelancerEmail,
            task_id: taskId,
            amount: Number(amount),
            transaction_id: `txn_dummy_${Date.now()}`,
            payment_status: "complete",
            paid_at: new Date().toISOString(),
          },
        }),
      });
      if (!paymentRes.ok) throw new Error("Failed to record payment.");

      // Redirect to success
      router.push("/dashboard/client/proposals");
    } catch (err) {
      alert(`Payment failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-12 px-4 font-sans select-none">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-sm">S</div>
            <span className="font-black tracking-tighter text-lg uppercase">SkillSwap</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-black">
            Payment Checkout
          </h1>
          <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
            Secure Payment Gateway
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-black/10 p-6 mb-6 shadow-sm">
          <h2 className="text-[9px] font-bold tracking-widest text-black/40 uppercase mb-4 border-b border-black/10 pb-3">
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-black/60 uppercase tracking-wider">Task</span>
              <span className="text-xs font-black text-black text-right max-w-[250px] truncate">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-bold text-black/60 uppercase tracking-wider">Freelancer</span>
              <span className="text-xs font-medium text-black/70">{freelancerEmail}</span>
            </div>
            <div className="flex justify-between border-t border-black/10 pt-3 mt-3">
              <span className="text-sm font-black text-black uppercase tracking-wider">Total</span>
              <span className="text-xl font-black text-black tracking-tighter">${amount}</span>
            </div>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-white border border-black/10 p-8 shadow-sm">
          <h2 className="text-sm font-black tracking-widest text-black uppercase border-b border-black/10 pb-4 mb-6">
            Card Details
          </h2>

          <form onSubmit={handlePayment} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                placeholder="4242 4242 4242 4242"
                required
                className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20 font-mono tracking-wider"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value.slice(0, 5))}
                  placeholder="MM/YY"
                  required
                  className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20 font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
                  CVC
                </label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="123"
                  required
                  className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-black hover:bg-black/90 text-white py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer border border-black disabled:bg-black/40 disabled:cursor-not-allowed mt-4"
            >
              {processing ? "Processing Payment..." : `Pay $${amount}`}
            </button>
          </form>

          <p className="text-[9px] text-black/30 font-bold tracking-wider uppercase text-center mt-4">
            🔒 This is a dummy checkout page for demonstration purposes only.
          </p>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.back()}
            className="text-[10px] font-bold tracking-widest text-black/40 uppercase hover:text-black transition-colors cursor-pointer"
          >
            ← Back to Proposals
          </button>
        </div>
      </div>
    </main>
  );
}

export default function PaymentCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center text-xs font-bold tracking-widest text-black/40 uppercase">
          Loading Checkout...
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
