"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ClientDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState({
    totalTasks: 0,
    openTasks: 0,
    inProgress: 0,
    totalSpent: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
  if (!user?.email) return;

  let active = true;

  const fetchDashboardData = async () => {
    try {
      setLoadingTasks(true);

      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

      // Get auth token
      const tokenResponse = await authClient.token();

      if (tokenResponse.error) {
        throw new Error(
          tokenResponse.error.message || "Failed to retrieve auth token."
        );
      }

      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error("Failed to retrieve auth token.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch both endpoints concurrently
      const [statsRes, tasksRes] = await Promise.all([
        fetch(
          `${serverUrl}/api/client/stats/${encodeURIComponent(user.email)}`,
          { headers }
        ),
        fetch(
          `${serverUrl}/api/tasks/client/${encodeURIComponent(user.email)}`,
          { headers }
        ),
      ]);

      if (!statsRes.ok) {
        throw new Error("Failed to fetch stats.");
      }

      if (!tasksRes.ok) {
        throw new Error("Failed to fetch tasks.");
      }

      const [statsData, tasksData] = await Promise.all([
        statsRes.json(),
        tasksRes.json(),
      ]);

      if (!active) return;

      setStats(statsData);
      setRecentTasks(tasksData.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      if (active) {
        setLoadingTasks(false);
      }
    }
  };

  fetchDashboardData();

  return () => {
    active = false;
  };
}, [user?.email]);

  return (
    <div className="space-y-10 select-none">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-black/10 pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
            Client Overview
          </h1>
          <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
            {user?.name ? `${user.name} Operations` : "Demo Corp Operations"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Report generation started...")}
            className="bg-white hover:bg-black/5 text-black border border-black px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 rounded-none cursor-pointer"
          >
            Export Report
          </button>
          <Link href="/dashboard/client/tasks/post">
            <button className="bg-black hover:bg-black/90 text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 rounded-none cursor-pointer border border-black">
              + New Task
            </button>
          </Link>
        </div>
      </div>

      {/* Metrics Brutalist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks Card */}
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">
              Total Tasks
            </span>
            <span className="text-xs font-bold tracking-tight text-black/60 block">
              active / total tasks
            </span>
          </div>
          <span className="text-4xl font-black text-black tracking-tighter leading-none mt-4">
            {stats.totalTasks}
          </span>
        </div>

        {/* Open Bids Card */}
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">
              Open Bids
            </span>
            <span className="text-xs font-bold tracking-tight text-black/60 block">
              active responses
            </span>
          </div>
          <span className="text-4xl font-black text-black tracking-tighter leading-none mt-4">
            {stats.openTasks}
          </span>
        </div>

        {/* In Progress Card */}
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">
              In Progress
            </span>
            <span className="text-xs font-bold tracking-tight text-black/60 block">
              active tasks
            </span>
          </div>
          <span className="text-4xl font-black text-black tracking-tighter leading-none mt-4">
            {stats.inProgress}
          </span>
        </div>

        {/* Black Card: Total Spent */}
        <div className="bg-black text-white p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase block mb-1">
              Total Spent
            </span>
            <span className="text-xs font-bold tracking-tight text-white/60 block">
              lifetime payment volume
            </span>
          </div>
          <span className="text-3xl font-black text-white tracking-tighter leading-none mt-4">
            ${stats.totalSpent}
          </span>
        </div>
      </div>

      {/* Recent Activity Table Card */}
      <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none">
        <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6">
          <h2 className="text-sm font-black tracking-widest text-black uppercase">
            Recent Task Activity
          </h2>
          <Link href="/dashboard/client/tasks">
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase cursor-pointer hover:text-black">
              View All
            </span>
          </Link>
        </div>

        {loadingTasks ? (
          <div className="py-8 text-center text-xs font-bold tracking-widest text-black/40 uppercase">
            Loading recent activity...
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="bg-[#EAEAEA] border border-black/5 p-12 text-center flex flex-col items-center justify-center min-h-40 rounded-none">
            <span className="text-[10px] font-bold tracking-[0.2em] text-black uppercase block mb-1">
              No task activity
            </span>
            <span className="text-[9px] font-bold tracking-wider text-black/40 uppercase block">
              You haven&apos;t posted any tasks yet.
            </span>
          </div>
        ) : (
          /* Responsive Table wrapper */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-[9px] font-bold tracking-widest text-black/40 uppercase">
                  <th className="pb-3 pr-4 font-black">Project / Task</th>
                  <th className="pb-3 px-4 font-black">Category</th>
                  <th className="pb-3 px-4 font-black text-right">Budget</th>
                  <th className="pb-3 px-4 font-black text-right">Status</th>
                  <th className="pb-3 pl-4 font-black text-right">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs">
                {recentTasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-black/[0.01] transition-colors"
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
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          task.status?.toLowerCase() === "completed"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : task.status?.toLowerCase() === "in progress"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-black/40 text-right font-medium">
                      {task.deadline || "—"}
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
