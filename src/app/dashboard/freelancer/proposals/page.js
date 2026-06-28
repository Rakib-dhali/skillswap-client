"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FreelancerProposalsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.email) return;

    const fetchProposals = async () => {
      try {
        const tokenRes = await authClient.token();

        if (tokenRes.error) {
          throw new Error(
            tokenRes.error.message || "Failed to retrieve auth token.",
          );
        }

        const token = tokenRes.data?.token;

        if (!token) {
          throw new Error("Failed to retrieve auth token.");
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/proposals/freelancer/${encodeURIComponent(user.email)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) throw new Error("Failed to load proposals.");
        const data = await res.json();
        setProposals(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [user?.email]);

  // Compute stats from real data
  const stats = {
    total: proposals.length,
    pending: proposals.filter((p) => p.status === "pending" || p.status === "open").length,
    accepted: proposals.filter((p) => p.status === "accepted").length,
    rejected: proposals.filter((p) => p.status === "rejected").length,
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-600 border-red-200";
      case "pending":
      case "open":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffH < 1) return "Just now";
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="space-y-10 select-none">
        {/* Header skeleton */}
        <div className="border-b border-black/10 pb-8">
          <div className="h-10 w-72 bg-black/5 animate-pulse mb-3"></div>
          <div className="h-4 w-56 bg-black/5 animate-pulse"></div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-black/10 p-6 min-h-28 animate-pulse rounded-none">
              <div className="h-3 w-20 bg-black/5 mb-4"></div>
              <div className="h-8 w-14 bg-black/5"></div>
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-white border border-black/10 p-8 rounded-none">
          <div className="h-4 w-40 bg-black/5 mb-8 animate-pulse"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-6 mb-4 animate-pulse">
              <div className="h-4 w-48 bg-black/5"></div>
              <div className="h-4 w-20 bg-black/5"></div>
              <div className="h-4 w-16 bg-black/5"></div>
              <div className="h-4 w-24 bg-black/5"></div>
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

      {/* Header Deck */}
      <div className="border-b border-black/10 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
            My Proposals
          </h1>
          <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
            Submitted Bid Applications
          </p>
        </div>
        <Link href="/dashboard/freelancer/tasks">
          <button className="bg-black hover:bg-black/90 text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 rounded-none cursor-pointer border border-black">
            Browse Tasks
          </button>
        </Link>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-28 rounded-none">
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Total Proposals</span>
          <span className="text-3xl font-black text-black tracking-tighter leading-none mt-2">{stats.total}</span>
        </div>
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-28 rounded-none">
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Pending</span>
          <span className="text-3xl font-black text-amber-600 tracking-tighter leading-none mt-2">{stats.pending}</span>
        </div>
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-28 rounded-none">
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Accepted</span>
          <span className="text-3xl font-black text-emerald-600 tracking-tighter leading-none mt-2">{stats.accepted}</span>
        </div>
        <div className="bg-black text-white p-6 shadow-sm flex flex-col justify-between min-h-28 rounded-none">
          <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase block mb-1">Rejected</span>
          <span className="text-3xl font-black text-white tracking-tighter leading-none mt-2">{stats.rejected}</span>
        </div>
      </div>

      {/* Proposals Table Card */}
      <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none">
        <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6">
          <h2 className="text-sm font-black tracking-widest text-black uppercase">
            All Proposals
          </h2>
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase">
            {stats.total} Total
          </span>
        </div>

        {proposals.length === 0 ? (
          /* Empty State */
          <div className="bg-[#EAEAEA] border border-black/5 p-12 text-center flex flex-col items-center justify-center min-h-60 rounded-none">
            <div className="w-10 h-10 bg-white border border-black/10 flex items-center justify-center text-lg mb-4 shadow-sm">
              📥
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-black uppercase block mb-1">
              No Proposals Yet
            </span>
            <span className="text-[9px] font-bold tracking-wider text-black/40 uppercase block max-w-sm leading-relaxed">
              Browse available tasks and submit your first bid to get started.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-[9px] font-bold tracking-widest text-black/40 uppercase">
                  <th className="pb-3 pr-4 font-black">Task</th>
                  <th className="pb-3 px-4 font-black">Category</th>
                  <th className="pb-3 px-4 font-black text-right">Your Bid</th>
                  <th className="pb-3 px-4 font-black text-right">Task Budget</th>
                  <th className="pb-3 px-4 font-black text-center">Days</th>
                  <th className="pb-3 px-4 font-black text-right">Status</th>
                  <th className="pb-3 pl-4 font-black text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs">
                {proposals.map((p) => (
                  <tr key={p._id} className="hover:bg-black/[0.02] transition-colors duration-150">
                    <td className="py-4 pr-4 font-bold text-black tracking-tight max-w-xs">
                      <span className="block truncate uppercase">{p.task_title}</span>
                    </td>
                    <td className="py-4 px-4 text-black/50 font-medium uppercase text-[10px] tracking-wider">
                      {p.task_category || "—"}
                    </td>
                    <td className="py-4 px-4 font-black text-black text-right">
                      ${p.proposed_budget}
                    </td>
                    <td className="py-4 px-4 text-black/50 text-right font-medium">
                      ${p.task_budget}
                    </td>
                    <td className="py-4 px-4 text-black/70 text-center font-bold">
                      {p.estimated_days}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border ${getStatusStyle(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-black/40 text-right font-medium whitespace-nowrap">
                      {formatDate(p.submitted_at)}
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
