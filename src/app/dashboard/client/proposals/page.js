"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientProposalsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchProposals = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/proposals/client/${encodeURIComponent(user.email)}`,
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

  // Redirect to dummy Stripe checkout page
 const handleAcceptWithPayment = async (e, proposal) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("price", proposal.proposed_budget);
    formData.append("title", proposal.task_title);
    formData.append("taskId", proposal._id); // proposal id
    formData.append("actualTaskId", proposal.task_id); // task id
    formData.append("freelancerEmail", proposal.freelancer_email);

    const response = await fetch("/api/payment", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create checkout session");
    }

    window.location.assign(data.url);
  } catch (error) {
    alert(error.message);
  }
};
  // Standard reject updates remain direct REST calls
  const handleStatusUpdate = async (proposalId, newStatus) => {
    setUpdatingId(proposalId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/proposals/${proposalId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!res.ok) throw new Error("Failed to update status.");

      setProposals((prev) =>
        prev.map((p) =>
          p._id === proposalId ? { ...p, status: newStatus } : p,
        ),
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
    pending: proposals.filter(
      (p) => p.status === "pending" || p.status === "open",
    ).length,
    accepted: proposals.filter((p) => p.status === "accepted").length,
    rejected: proposals.filter((p) => p.status === "rejected").length,
  };

  // Check which task_ids already have an accepted proposal
  const tasksWithAccepted = new Set(
    proposals.filter((p) => p.status === "accepted").map((p) => p.task_id)
  );

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
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-10 select-none p-6 max-w-7xl mx-auto">
        <div className="h-10 w-80 bg-black/5 animate-pulse mb-3" />
        <div className="h-4 w-56 bg-black/5 animate-pulse mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-black/10 p-6 min-h-28 animate-pulse" />
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
    <div className="space-y-10 select-none max-w-7xl mx-auto p-6">
      {/* Header Deck */}
      <div className="border-b border-black/10 pb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
          Manage Proposals
        </h1>
        <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
          Bids Submitted to Your Tasks
        </p>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-black/10 p-6 flex flex-col justify-between min-h-28">
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase">Total Received</span>
          <span className="text-3xl font-black text-black tracking-tighter mt-2">{stats.total}</span>
        </div>
        <div className="bg-white border border-black/10 p-6 flex flex-col justify-between min-h-28">
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase">Pending Review</span>
          <span className="text-3xl font-black text-amber-600 tracking-tighter mt-2">{stats.pending}</span>
        </div>
        <div className="bg-white border border-black/10 p-6 flex flex-col justify-between min-h-28">
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase">Accepted</span>
          <span className="text-3xl font-black text-emerald-600 tracking-tighter mt-2">{stats.accepted}</span>
        </div>
        <div className="bg-black text-white p-6 flex flex-col justify-between min-h-28">
          <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase">Rejected</span>
          <span className="text-3xl font-black text-white tracking-tighter mt-2">{stats.rejected}</span>
        </div>
      </div>

      {/* Proposals Table Card */}
      <div className="bg-white border border-black/10 p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6">
          <h2 className="text-sm font-black tracking-widest text-black uppercase">All Received Bids</h2>
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase">{stats.total} Total</span>
        </div>

        {proposals.length === 0 ? (
          <div className="bg-[#EAEAEA] border border-black/5 p-12 text-center flex flex-col items-center justify-center min-h-60">
            <span className="text-[10px] font-bold tracking-[0.2em] text-black uppercase block mb-1">No Proposals Received</span>
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
                  <th className="pb-3 px-4 font-black">Message</th>
                  <th className="pb-3 px-4 font-black text-right">Status</th>
                  <th className="pb-3 px-4 font-black text-right">Submitted</th>
                  <th className="pb-3 pl-4 font-black text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs">
                {proposals.map((p) => {
                  const isPending = p.status === "pending" || p.status === "open";
                  const isUpdating = updatingId === p._id;
                  const taskAlreadyAccepted = tasksWithAccepted.has(p.task_id);

                  return (
                    <tr key={p._id} className="hover:bg-black/[0.02] transition-colors duration-150">
                      <td className="py-4 pr-4 font-bold text-black uppercase tracking-tight max-w-xs truncate">
                        {p.task_title}
                      </td>
                      <td className="py-4 px-4">
                        <span className="block font-bold text-black">{p.freelancer_name || "Anonymous"}</span>
                        <span className="block text-[9px] text-black/40 mt-0.5">{p.freelancer_email}</span>
                      </td>
                      <td className="py-4 px-4 font-black text-black text-right">${p.proposed_budget}</td>
                      <td className="py-4 px-4 text-black/70 text-center font-bold">{p.estimated_days}</td>
                      <td className="py-4 px-4 text-black/60 max-w-[200px]">
                        <p className="truncate text-[10px]" title={p.cover_note}>{p.cover_note || "—"}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border ${getStatusStyle(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-black/40 text-right whitespace-nowrap">{formatDate(p.submitted_at)}</td>
                      <td className="py-4 pl-4 text-center">
                        {isPending && !taskAlreadyAccepted ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => handleAcceptWithPayment(e, p)}
                              disabled={isUpdating}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors disabled:opacity-40 border border-emerald-700 cursor-pointer"
                            >
                              {isUpdating ? "Processing..." : "Accept"}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(p._id, "rejected")}
                              disabled={isUpdating}
                              className="bg-white hover:bg-red-50 text-red-600 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors disabled:opacity-40 border border-red-300 cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[9px] font-bold tracking-wider text-black/30 uppercase">
                            {taskAlreadyAccepted && isPending ? "Task Filled" : "Resolved"}
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
    </div>
  );
}