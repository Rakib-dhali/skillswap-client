"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ActiveProjectsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user?.email) return;

    let active = true;
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${serverUrl}/api/freelancer/active-projects/${encodeURIComponent(user.email)}`
        );
        if (!res.ok) throw new Error("Failed to load projects.");
        const data = await res.json();
        if (active) setProjects(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProjects();

    return () => {
      active = false;
    };
  }, [user?.email, refreshTrigger, serverUrl]);

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    if (!deliverableUrl.trim()) return;

    setSubmitting(true);
    try {
      const tokenRes = await authClient.token();
      const res = await fetch(`${serverUrl}/api/tasks/${selectedProjectId}/deliverable`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenRes?.data?.token}` },
        body: JSON.stringify({ deliverable_url: deliverableUrl }),
      });
      if (!res.ok) throw new Error("Failed to submit deliverable.");

      setSelectedProjectId(null);
      setDeliverableUrl("");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
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
      <div className="border-b border-black/10 pb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
          Active Projects
        </h1>
        <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
          Your In Progress & Completed Client Jobs
        </p>
      </div>

      {/* Projects Grid/Table */}
      <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none">
        <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6">
          <h2 className="text-sm font-black tracking-widest text-black uppercase">
            All Assigned Projects
          </h2>
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase">
            {projects.length} Total
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="bg-[#EAEAEA] border border-black/5 p-12 text-center flex flex-col items-center justify-center min-h-60 rounded-none">
            <span className="text-[10px] font-bold tracking-[0.2em] text-black uppercase block mb-1">
              No Projects Yet
            </span>
            <span className="text-[9px] font-bold tracking-wider text-black/40 uppercase block">
              Proposals you submit will appear here when accepted by clients.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-[9px] font-bold tracking-widest text-black/40 uppercase">
                  <th className="pb-3 pr-4 font-black">Project Name</th>
                  <th className="pb-3 px-4 font-black">Category</th>
                  <th className="pb-3 px-4 font-black text-right">Agreed Budget</th>
                  <th className="pb-3 px-4 font-black text-center">Duration</th>
                  <th className="pb-3 px-4 font-black text-center">Status</th>
                  <th className="pb-3 pl-4 font-black text-center">Deliverable</th>
                  <th className="pb-3 pl-4 font-black text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs">
                {projects.map((project) => {
                  const isInProgress = project.status?.toLowerCase() === "in progress";
                  const isCompleted = project.status?.toLowerCase() === "completed";

                  return (
                    <tr key={project._id} className="hover:bg-black/[0.02] transition-colors duration-150">
                      <td className="py-4 pr-4 font-bold text-black uppercase tracking-tight max-w-xs truncate">
                        {project.title}
                      </td>
                      <td className="py-4 px-4 text-black/50 font-medium uppercase text-[10px] tracking-wider">
                        {project.category}
                      </td>
                      <td className="py-4 px-4 font-black text-black text-right">
                        ${project.proposed_budget || project.budget}
                      </td>
                      <td className="py-4 px-4 text-black/50 text-center font-medium whitespace-nowrap">
                        {project.estimated_days} days
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-center max-w-[150px] truncate text-black/50 font-mono text-[10px]">
                        {project.deliverable_url ? (
                          <a 
                            href={project.deliverable_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline text-blue-600 font-bold uppercase tracking-wider text-[9px] hover:text-blue-800"
                          >
                            View Link
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-4 pl-4 text-center">
                        {isInProgress && (
                          <button
                            onClick={() => setSelectedProjectId(project._id)}
                            className="bg-black hover:bg-black/90 text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors border border-black cursor-pointer"
                          >
                            Submit Deliverable
                          </button>
                        )}
                        {isCompleted && (
                          <span className="text-[9px] font-bold tracking-wider text-emerald-600 uppercase">
                            Done
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

      {/* Deliverable Submission Modal */}
      {selectedProjectId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black/10 p-8 shadow-lg w-full max-w-lg rounded-none">
            <h3 className="text-sm font-black tracking-widest text-black uppercase mb-6 border-b border-black/10 pb-4">
              Submit Project Deliverable
            </h3>
            <form onSubmit={handleSubmitDeliverable} className="space-y-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
                  Deliverable URL (e.g. GitHub link, Figma preview, deployed site)
                </label>
                <input
                  type="url"
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  required
                  className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProjectId(null);
                    setDeliverableUrl("");
                  }}
                  className="bg-white hover:bg-black/5 text-black px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors border border-black rounded-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-black hover:bg-black/90 text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors border border-black rounded-none cursor-pointer disabled:opacity-40"
                >
                  {submitting ? "Submitting..." : "Submit Deliverable"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
