"use client";

import { useEffect, useState } from "react";

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    let active = true;
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const tokenResponse = await authClient.token();
        if (tokenResponse.error) {
          throw new Error(
            tokenResponse.error.message || "Failed to retrieve auth token.",
          );
        }
        const token = tokenResponse.data?.token;
        if (!token) {
          throw new Error("Failed to retrieve auth token.");
        }
    const res = await fetch(`${serverUrl}/api/payments`, {
           headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Unable to load transactions.");
        const data = await res.json();
        if (active) setPayments(data);
      } catch (err) {
        if (active)
          setError(err.message || "Failed to load transaction history.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchPayments();
    return () => {
      active = false;
    };
  }, [serverUrl]);

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-10 select-none">
      <div className="border-b border-black/10 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
            Transactions
          </h1>
          <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
            Stripe payment history and settlement details
          </p>
        </div>
      </div>

      {error ? (
        <div className="bg-white border border-red-200 text-red-700 p-6 rounded-none">
          <p className="font-bold uppercase text-sm">Unable to load payments</p>
          <p className="mt-2 text-xs text-red-600">{error}</p>
        </div>
      ) : null}

      <div className="bg-white border border-black/10 p-6 shadow-sm rounded-none overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-black/5 text-[9px] font-bold uppercase tracking-widest text-black/50">
            <tr>
              <th className="py-4 px-3">Transaction</th>
              <th className="py-4 px-3">Task ID</th>
              <th className="py-4 px-3">Client</th>
              <th className="py-4 px-3">Freelancer</th>
              <th className="py-4 px-3">Amount</th>
              <th className="py-4 px-3">Status</th>
              <th className="py-4 px-3">Paid At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 text-sm">
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-4 px-3 h-8 bg-black/5"></td>
                  <td className="py-4 px-3 h-8 bg-black/5"></td>
                  <td className="py-4 px-3 h-8 bg-black/5"></td>
                  <td className="py-4 px-3 h-8 bg-black/5"></td>
                  <td className="py-4 px-3 h-8 bg-black/5"></td>
                  <td className="py-4 px-3 h-8 bg-black/5"></td>
                  <td className="py-4 px-3 h-8 bg-black/5"></td>
                </tr>
              ))
            ) : payments.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="py-8 text-center text-sm text-black/50"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="hover:bg-black/2 transition-colors"
                >
                  <td className="py-4 px-3 font-mono text-xs text-black uppercase tracking-widest">
                    {payment.transaction_id || payment._id}
                  </td>
                  <td className="py-4 px-3 text-black/70 text-xs max-w-40 truncate">
                    {payment.task_id || "—"}
                  </td>
                  <td className="py-4 px-3 text-black/70 text-xs">
                    {payment.client_email}
                  </td>
                  <td className="py-4 px-3 text-black/70 text-xs">
                    {payment.freelancer_email}
                  </td>
                  <td className="py-4 px-3 font-black text-black text-xs">
                    ${payment.amount ?? 0}
                  </td>
                  <td className="py-4 px-3 text-xs uppercase tracking-wider">
                    <span className="inline-flex px-2.5 py-1 rounded-full bg-black/5 text-black/70">
                      {payment.payment_status || "complete"}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-black/50 text-xs">
                    {formatDate(payment.paid_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
