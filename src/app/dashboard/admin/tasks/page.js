"use client";

import { useEffect, useState } from "react";

const statusOptions = ["open", "in progress", "completed"];

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    let active = true;
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${serverUrl}/api/admin/tasks`);
        if (!res.ok) throw new Error("Unable to load tasks.");
        const data = await res.json();
        if (active) setTasks(data);
      } catch (err) {
        if (active) setError(err.message || "Failed to load tasks.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTasks();
    return () => {
      active = false;
    };
  }, [serverUrl]);

  const updateStatus = async (taskId, status) => {
    setSavingId(taskId);
    try {
      const res = await fetch(`${serverUrl}/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Unable to update task status.");
      setTasks((current) =>
        current.map((task) => (task._id === taskId ? { ...task, status } : task)),
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update status.");
    } finally {
      setSavingId(null);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task permanently?")) return;
    setSavingId(taskId);

    try {
      const res = await fetch(`${serverUrl}/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Unable to delete task.");
      }
      setTasks((current) => current.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete task.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-10 select-none">
      <div className="border-b border-black/10 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
            Manage Tasks
          </h1>
          <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
            Review active tasks, update status, or remove stale listings
          </p>
        </div>
      </div>

      {error ? (
        <div className="bg-white border border-red-200 text-red-700 p-6 rounded-none">
          <p className="font-bold uppercase text-sm">Task update failed</p>
          <p className="mt-2 text-xs text-red-600">{error}</p>
        </div>
      ) : null}

      <div className="bg-white border border-black/10 p-6 shadow-sm rounded-none overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-black/5 text-[9px] font-bold uppercase tracking-widest text-black/50">
            <tr>
              <th className="py-4 px-3">Task</th>
              <th className="py-4 px-3">Client</th>
              <th className="py-4 px-3">Budget</th>
              <th className="py-4 px-3">Status</th>
              <th className="py-4 px-3">Actions</th>
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
                </tr>
              ))
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-sm text-black/50">
                  No tasks available.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id} className="hover:bg-black/2 transition-colors">
                  <td className="py-4 px-3 font-bold text-black uppercase tracking-tight text-xs max-w-xs truncate">
                    {task.title}
                  </td>
                  <td className="py-4 px-3 text-black/70 text-xs">
                    {task.client_email || task.client?.name || "Unknown"}
                  </td>
                  <td className="py-4 px-3 text-black/70 text-xs">
                    ${task.budget?.toLocaleString() ?? "0"}
                  </td>
                  <td className="py-4 px-3 text-xs uppercase tracking-widest">
                    <select
                      value={task.status || "open"}
                      onChange={(event) => updateStatus(task._id, event.target.value)}
                      disabled={savingId === task._id}
                      className="border border-black/10 px-2 py-1 text-[10px] uppercase tracking-widest"
                    >
                      {statusOptions.map((statusValue) => (
                        <option key={statusValue} value={statusValue}>
                          {statusValue}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-3 space-x-2">
                    <button
                      type="button"
                      onClick={() => deleteTask(task._id)}
                      disabled={savingId === task._id}
                      className="bg-red-700 text-white uppercase tracking-widest text-[10px] px-3 py-2 disabled:opacity-40"
                    >
                      Delete
                    </button>
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
