"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function ClientProposalsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchProposals = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/proposals/client/${encodeURIComponent(user.email)}`
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

  // Handle accept / reject
  const handleStatusUpdate = async (proposalId, newStatus) => {
    setUpdatingId(proposalId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/proposals/${proposalId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status.");

      // Optimistic update
      setProposals((prev) =>
        prev.map((p) =>
          p._id === proposalId ? { ...p, status: newStatus } : p
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Compute stats
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
        <div className="border-b border-black/10 pb-8">
          <div className="h-10 w-80 bg-black/5 animate-pulse mb-3"></div>
          <div className="h-4 w-56 bg-black/5 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-black/10 p-6 min-h-28 animate-pulse rounded-none">
              <div className="h-3 w-20 bg-black/5 mb-4"></div>
              <div className="h-8 w-14 bg-black/5"></div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-black/10 p-8 rounded-none">
          <div className="h-4 w-48 bg-black/5 mb-8 animate-pulse"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-6 mb-4 animate-pulse">
              <div className="h-4 w-48 bg-black/5"></div>
              <div className="h-4 w-28 bg-black/5"></div>
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
      <div className="border-b border-black/10 pb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
          Received Proposals
        </h1>
        <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
          Bids Submitted to Your Tasks
        </p>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-28 rounded-none">
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Total Received</span>
          <span className="text-3xl font-black text-black tracking-tighter leading-none mt-2">{stats.total}</span>
        </div>
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-28 rounded-none">
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Pending Review</span>
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
            All Received Bids
          </h2>
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase">
            {stats.total} Total
          </span>
        </div>

        {proposals.length === 0 ? (
          /* Empty State */
          <div className="bg-[#EAEAEA] border border-black/5 p-12 text-center flex flex-col items-center justify-center min-h-60 rounded-none">
            <div className="w-10 h-10 bg-white border border-black/10 flex items-center justify-center text-lg mb-4 shadow-sm">
              📩
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-black uppercase block mb-1">
              No Proposals Received
            </span>
            <span className="text-[9px] font-bold tracking-wider text-black/40 uppercase block max-w-sm leading-relaxed">
              Post tasks to start receiving bids from freelancers in the marketplace.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-[9px] font-bold tracking-widest text-black/40 uppercase">
                  <th className="pb-3 pr-4 font-black">Task</th>
                  <th className="pb-3 px-4 font-black">Freelancer</th>
                  <th className="pb-3 px-4 font-black text-right">Bid</th>
                  <th className="pb-3 px-4 font-black text-center">Days</th>
                  <th className="pb-3 px-4 font-black text-right">Status</th>
                  <th className="pb-3 px-4 font-black text-right">Submitted</th>
                  <th className="pb-3 pl-4 font-black text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs">
                {proposals.map((p) => {
                  const isPending = p.status === "pending" || p.status === "open";
                  const isUpdating = updatingId === p._id;

                  return (
                    <tr key={p._id} className="hover:bg-black/[0.02] transition-colors duration-150">
                      <td className="py-4 pr-4 font-bold text-black tracking-tight max-w-xs">
                        <span className="block truncate uppercase">{p.task_title}</span>
                        <span className="block text-[9px] text-black/40 font-medium uppercase tracking-wider mt-0.5">
                          {p.task_category || "—"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="block font-bold text-black tracking-tight">{p.freelancer_name || "Anonymous"}</span>
                        <span className="block text-[9px] text-black/40 font-medium mt-0.5 truncate max-w-[160px]">
                          {p.freelancer_email}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-black text-black text-right">
                        ${p.proposed_budget}
                      </td>
                      <td className="py-4 px-4 text-black/70 text-center font-bold">
                        {p.estimated_days}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border ${getStatusStyle(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-black/40 text-right font-medium whitespace-nowrap">
                        {formatDate(p.submitted_at)}
                      </td>
                      <td className="py-4 pl-4 text-center">
                        {isPending ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleStatusUpdate(p._id, "accepted")}
                              disabled={isUpdating}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors duration-200 rounded-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-700"
                            >
                              {isUpdating ? "..." : "Accept"}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(p._id, "rejected")}
                              disabled={isUpdating}
                              className="bg-white hover:bg-red-50 text-red-600 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors duration-200 rounded-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-red-300"
                            >
                              {isUpdating ? "..." : "Reject"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[9px] font-bold tracking-wider text-black/30 uppercase">
                            Resolved
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cover Note Expandable Cards (for pending proposals) */}
      {proposals.filter((p) => p.status === "pending" || p.status === "open").length > 0 && (
        <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none">
          <h2 className="text-sm font-black tracking-widest text-black uppercase border-b border-black/10 pb-4 mb-6">
            Pending Cover Notes
          </h2>
          <div className="space-y-4">
            {proposals
              .filter((p) => p.status === "pending" || p.status === "open")
              .map((p) => (
                <div key={p._id + "-note"} className="border border-black/10 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-black text-black uppercase tracking-tight block">
                        {p.freelancer_name || "Anonymous"}
                      </span>
                      <span className="text-[9px] font-bold tracking-wider text-black/40 uppercase">
                        on {p.task_title}  •  ${p.proposed_budget} bid  •  {p.estimated_days} days
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusUpdate(p._id, "accepted")}
                        disabled={updatingId === p._id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer disabled:opacity-40 border border-emerald-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(p._id, "rejected")}
                        disabled={updatingId === p._id}
                        className="bg-white hover:bg-red-50 text-red-600 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer disabled:opacity-40 border border-red-300"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-black/70 leading-relaxed tracking-tight whitespace-pre-wrap">
                    {p.cover_note || "No cover note provided."}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

    </div>
  );
}
