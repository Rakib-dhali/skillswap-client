"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function MyTasksPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [updating, setUpdating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user?.email) return;

    let active = true;
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${serverUrl}/api/tasks/client/${encodeURIComponent(user.email)}`,
        );
        if (!res.ok) throw new Error("Failed to load tasks.");
        const data = await res.json();
        if (active) setTasks(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTasks();

    return () => {
      active = false;
    };
  }, [user?.email, refreshTrigger, serverUrl]);

  const handleEdit = (task) => {
    setEditingId(task._id);
    setEditDescription(task.description);
  };
  const handleSaveEdit = async (taskId) => {
    setUpdating(true);
    try {
      const tokenRes = await authClient.token();
      const res = await fetch(`${serverUrl}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenRes?.data?.token}`,
        },
        body: JSON.stringify({ description: editDescription }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update task.");
      }
      setEditingId(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const tokenRes = await authClient.token();
      const res = await fetch(`${serverUrl}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenRes?.data?.token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete task.");
      }
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "in progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "open":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
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
          {[...Array(4)].map((_, i) => (
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
            My Tasks
          </h1>
          <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
            Manage Your Posted Tasks
          </p>
        </div>
        <Link href="/dashboard/client/tasks/post">
          <button className="bg-black hover:bg-black/90 text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 rounded-none cursor-pointer border border-black">
            + Post New Task
          </button>
        </Link>
      </div>

      {/* Tasks Table */}
      <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none">
        <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6">
          <h2 className="text-sm font-black tracking-widest text-black uppercase">
            All Tasks
          </h2>
          <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase">
            {tasks.length} Total
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-[#EAEAEA] border border-black/5 p-12 text-center flex flex-col items-center justify-center min-h-60 rounded-none">
            <span className="text-[10px] font-bold tracking-[0.2em] text-black uppercase block mb-1">
              No Tasks Posted Yet
            </span>
            <span className="text-[9px] font-bold tracking-wider text-black/40 uppercase block">
              Start by posting your first task.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-[9px] font-bold tracking-widest text-black/40 uppercase">
                  <th className="pb-3 pr-4 font-black">Task Title</th>
                  <th className="pb-3 px-4 font-black">Category</th>
                  <th className="pb-3 px-4 font-black text-right">Budget</th>
                  <th className="pb-3 px-4 font-black text-right">Deadline</th>
                  <th className="pb-3 px-4 font-black text-center">Status</th>
                  <th className="pb-3 pl-4 font-black text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs">
                {tasks.map((task) => {
                  const isEditing = editingId === task._id;
                  return (
                    <tr
                      key={task._id}
                      className="hover:bg-black/[0.02] transition-colors duration-150"
                    >
                      <td className="py-4 pr-4 font-bold text-black uppercase tracking-tight max-w-xs truncate">
                        {task.title}
                      </td>
                      <td className="py-4 px-4 text-black/50 font-medium uppercase text-[10px] tracking-wider">
                        {task.category}
                      </td>
                      <td className="py-4 px-4 font-black text-black text-right">
                        ${task.budget}
                      </td>
                      <td className="py-4 px-4 text-black/50 text-right font-medium whitespace-nowrap">
                        {task.deadline || "—"}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border ${getStatusStyle(task.status)}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {task.status === "open" && (
                            <button
                              onClick={() => handleEdit(task)}
                              className="bg-white hover:bg-blue-50 text-blue-600 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors border border-blue-300 cursor-pointer"
                            >
                              Edit
                            </button>
                          )}
                          {!task.hasAcceptedProposal && (
                            <button
                              onClick={() => handleDelete(task._id)}
                              className="bg-white hover:bg-red-50 text-red-600 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors border border-red-300 cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black/10 p-8 shadow-lg w-full max-w-lg rounded-none">
            <h3 className="text-sm font-black tracking-widest text-black uppercase mb-6 border-b border-black/10 pb-4">
              Edit Task Description
            </h3>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={6}
              className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none resize-none mb-6"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingId(null)}
                className="bg-white hover:bg-black/5 text-black px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors border border-black rounded-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editingId)}
                disabled={updating}
                className="bg-black hover:bg-black/90 text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors border border-black rounded-none cursor-pointer disabled:opacity-40"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
