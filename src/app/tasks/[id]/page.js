"use client";

import { authClient } from "@/lib/auth-client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DynamicTaskDetailsPage() {
  const { id } = useParams(); 
  const { data: session } = authClient.useSession();
  
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [checkingProposal, setCheckingProposal] = useState(false);

  // Fetch the specific task data using the URL ID
  useEffect(() => {
    if (!id) return;

    const fetchTaskDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/${id}`);
        if (!res.ok) throw new Error("Task profile not found or server error.");
        const data = await res.json();
        setTask(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      }
    };

    fetchTaskDetails();
  }, [id]);

  useEffect(() => {
    let active = true;

    const checkExistingProposal = async () => {
      try {
        if (!id || !session?.user?.email || session?.user?.role !== "freelancer") {
          if (active) setHasSubmitted(false);
          return;
        }

        if (active) setCheckingProposal(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/proposals/freelancer/${encodeURIComponent(session.user.email)}`
        );
        if (res.ok && active) {
          const proposals = await res.json();
          const alreadySubmitted = proposals.some((p) => p.task_id === id);
          setHasSubmitted(alreadySubmitted);
        }
      } catch (err) {
        console.error("Error checking existing proposal:", err);
      } finally {
        if (active) setCheckingProposal(false);
      }
    };

    checkExistingProposal();

    return () => {
      active = false;
    };
  }, [id, session?.user?.email, session?.user?.role]);

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSuccessMsg("");
    const formData = new FormData(e.currentTarget);
    const proposalPayload = {
      task_id: id,
      freelancer_email: session?.user?.email,
      freelancer_name: session?.user?.name,
      proposed_budget: formData.get("budget"),
      estimated_days: formData.get("days"),
      cover_note: formData.get("coverNote"),
      status: "pending",
      submitted_at: new Date(),
    };

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/proposals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(proposalPayload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Could not submit your bid proposal.");
      }
      
      setSuccessMsg("PROPOSAL SUBMITTED SUCCESSFULLY.");
      setHasSubmitted(true);
      e.target.reset();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (error || !task) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center text-xs font-bold tracking-widest text-red-600 uppercase">
        ⚠️ Error: {error || "Task data unavailable."}
      </div>
    );
  }

  return (
    <main className="min-h-screen mt-10 bg-[#F5F5F5] py-12 select-none font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Upper Architecture: Title Header & Tag Meta Segment */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-black uppercase leading-tight max-w-4xl mb-4">
            {task.title}
          </h1>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-black/60">
            {task.tags?.map((tag, idx) => (
              <span key={idx} className="bg-[#EAEAEA] px-2 py-1 border border-black/5 rounded-none">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Workspace Layout Grid splitting Core Details vs Proposal Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT DECK: Task Body details blocks */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description Card */}
            <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none">
              <h2 className="text-lg font-black tracking-tight text-black uppercase mb-6">
                Task Description
              </h2>
              <div className="text-xs text-black/80 space-y-4 leading-relaxed tracking-tight whitespace-pre-wrap">
                {task.description}
              </div>
            </div>

            {/* Financial Parameters Deck */}
            <div className="bg-white border border-black/10 p-6 shadow-sm rounded-none grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Budget</span>
                <span className="text-sm sm:text-base font-black text-black tracking-tighter">
                  {task.budget ? `$${task.budget}` : "Not Specified"}
                </span>
              </div>
              <div className="border-l border-black/10 pl-4">
                <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Deadline</span>
                <span className="text-sm sm:text-base font-black text-black tracking-tighter">
                  {task.deadline || "No Deadline"}
                </span>
              </div>
              <div className="border-l border-black/10 pl-4">
                <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Task Type</span>
                <span className="text-sm sm:text-base font-black text-black tracking-tighter">
                  {task.type || "Fixed Price"}
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT DECK: Submit Proposal & Client Registry */}
          <div className="space-y-6">
            
            {/* Form Side Widget */}
            <div className="bg-white border border-black/10 p-6 shadow-sm rounded-none">
              <h3 className="text-sm font-black tracking-tight text-black uppercase border-b border-black/10 pb-4 mb-4">
                Submit Proposal
              </h3>

              {checkingProposal ? (
                <div className="text-[10px] font-bold tracking-wider text-black/40 uppercase py-6 text-center">
                  Checking bid status...
                </div>
              ) : !session?.user ? (
                <div className="space-y-4 py-4 text-center">
                  <p className="text-[10px] font-bold tracking-wider text-black/60 uppercase leading-relaxed">
                    Please sign in to submit a proposal for this task.
                  </p>
                  <a
                    href="/signin"
                    className="inline-block w-full bg-black text-white text-center text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-black/90 transition-colors border border-black rounded-none"
                  >
                    Go to Sign In
                  </a>
                </div>
              ) : session?.user?.role !== "freelancer" ? (
                <div className="p-4 bg-[#EAEAEA] border border-black/10 text-center">
                  <span className="text-[10px] font-bold tracking-wider text-black/60 uppercase block">
                    Clients cannot submit proposals.
                  </span>
                  <span className="text-[9px] text-black/40 uppercase font-bold tracking-wider block mt-1">
                    Log in as a freelancer to bid.
                  </span>
                </div>
              ) : task.status && task.status.toLowerCase() !== "open" ? (
                <div className="p-4 bg-amber-50 border border-amber-200 text-center">
                  <span className="text-[10px] font-bold tracking-wider text-amber-700 uppercase block">
                    This task is no longer open.
                  </span>
                  <span className="text-[9px] text-amber-600 uppercase font-bold tracking-wider block mt-1">
                    Live Status: {task.status}
                  </span>
                </div>
              ) : hasSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase block">
                    Proposal Submitted
                  </span>
                  <span className="text-[9px] text-emerald-600/75 uppercase font-bold tracking-wider block mt-1">
                    You have already applied to this task.
                  </span>
                </div>
              ) : (
                <>
                  {successMsg && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold tracking-wider uppercase">
                      ✓ {successMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmitProposal} className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold tracking-widest text-black/50 uppercase">
                        Your Bid (USD)
                      </label>
                      <input 
                        name="budget"
                        type="number" 
                        placeholder={task.budget || "1500"} 
                        className="w-full border border-black/20 px-3 py-2.5 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20"
                        required 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold tracking-widest text-black/50 uppercase">
                        Estimated Days
                      </label>
                      <input 
                        name="days"
                        type="number" 
                        placeholder="14" 
                        className="w-full border border-black/20 px-3 py-2.5 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20"
                        required 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold tracking-widest text-black/50 uppercase">
                        Cover Note
                      </label>
                      <textarea 
                        name="coverNote"
                        rows={4}
                        placeholder="Explain why you are the best fit..." 
                        className="w-full border border-black/20 px-3 py-2.5 text-xs text-black focus:outline-none focus:border-black rounded-none resize-none placeholder-black/20"
                        required 
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={submitLoading}
                      className="w-full bg-black text-white text-[11px] font-bold uppercase tracking-[0.15em] py-3 mt-2 hover:bg-black/90 transition-colors cursor-pointer disabled:bg-black/40 rounded-none"
                    >
                      {submitLoading ? "Submitting..." : "Submit Proposal"}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Client Context Information Badge */}
            <div className="bg-white border border-black/10 p-6 shadow-sm rounded-none">
              <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block border-b border-black/5 pb-3 mb-4">
                About the Client
              </span>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#EAEAEA] border border-black/10 flex items-center justify-center rounded-none text-black/40 font-bold text-sm">
                  🏢
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-tight text-black">
                    {task.client?.name || "Independent Client"}
                  </h4>
                  <span className="text-[9px] text-black/40 font-bold uppercase tracking-wider">
                    {task.client?.location || "International"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/5 text-left">
                <div>
                  <span className="text-[8px] font-bold tracking-widest text-black/40 uppercase block">Tasks Posted</span>
                  <span className="text-xs font-black text-black">
                    {task.client?.tasksPosted || 0}
                  </span>
                </div>
                <div className="border-l border-black/10 pl-3">
                  <span className="text-[8px] font-bold tracking-widest text-black/40 uppercase block">Hire Rate</span>
                  <span className="text-xs font-black text-black">
                    {task.client?.hireRate ? `${task.client.hireRate}%` : "100%"}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}