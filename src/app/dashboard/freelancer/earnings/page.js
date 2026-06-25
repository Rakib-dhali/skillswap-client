"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function EarningsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user?.email) return;

    let active = true;
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${serverUrl}/api/earnings/freelancer/${encodeURIComponent(user.email)}`
        );
        if (!res.ok) throw new Error("Failed to load earnings history.");
        const data = await res.json();
        if (active) setEarnings(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchEarnings();

    return () => {
      active = false;
    };
  }, [user?.email, serverUrl]);

  const totalEarningsAmount = earnings.reduce((sum, item) => sum + (item.amount || 0), 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " " + d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="space-y-10 select-none">
        <div className="border-b border-black/10 pb-8">
          <div className="h-10 w-72 bg-black/5 animate-pulse mb-3"></div>
          <div className="h-4 w-56 bg-black/5 animate-pulse"></div>
        </div>
        <div className="bg-white border border-black/10 p-8 rounded-none">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-6 mb-4 animate-pulse">
              <div className="h-4 w-48 bg-black/5"></div>
              <div className="h-4 w-20 bg-black/5"></div>
              <div className="h-4 w-16 bg-black/5"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs font-bold tracking-widest text-red-600 uppercase select-none">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="space-y-10 select-none">
      {/* Header */}
      <div className="border-b border-black/10 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
            My Earnings
          </h1>
          <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
            Track your lifetime payments & project payouts
          </p>
        </div>
        <div className="bg-black text-white px-6 py-4 shadow-sm min-w-44 flex flex-col justify-between">
          <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase block mb-1">
            Lifetime Balance
          </span>
          <span className="text-2xl font-black text-white tracking-tighter leading-none">
            ${totalEarningsAmount}
          </span>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none">
        <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6">
          <h2 className="text-sm font-black tracking-widest text-black uppercase">
            Payment Log Transactions
          </h2>
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase">
            {earnings.length} Payouts
          </span>
        </div>

        {earnings.length === 0 ? (
          <div className="bg-[#EAEAEA] border border-black/5 p-12 text-center flex flex-col items-center justify-center min-h-60 rounded-none">
            <span className="text-[10px] font-bold tracking-[0.2em] text-black uppercase block mb-1">
              No Earnings Recorded
            </span>
            <span className="text-[9px] font-bold tracking-wider text-black/40 uppercase block">
              Earnings will appear here once tasks are successfully funded.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-[9px] font-bold tracking-widest text-black/40 uppercase">
                  <th className="pb-3 pr-4 font-black">Transaction ID</th>
                  <th className="pb-3 px-4 font-black">Project / Task</th>
                  <th className="pb-3 px-4 font-black">Client Email</th>
                  <th className="pb-3 px-4 font-black text-right">Amount Paid</th>
                  <th className="pb-3 px-4 font-black text-center">Status</th>
                  <th className="pb-3 pl-4 font-black text-right">Paid At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs">
                {earnings.map((earning) => (
                  <tr key={earning._id} className="hover:bg-black/[0.02] transition-colors duration-150">
                    <td className="py-4 pr-4 font-mono font-bold text-black uppercase tracking-wider text-[10px]">
                      {earning.transaction_id || `txn_${earning._id.slice(0, 10)}`}
                    </td>
                    <td className="py-4 px-4 font-bold text-black uppercase tracking-tight max-w-xs truncate">
                      {earning.task_title}
                    </td>
                    <td className="py-4 px-4 text-black/60 font-medium">
                      {earning.client_email}
                    </td>
                    <td className="py-4 px-4 font-black text-black text-right">
                      ${earning.amount}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                        {earning.payment_status || "Complete"}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-black/50 text-right font-medium whitespace-nowrap">
                      {formatDate(earning.paid_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
