"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState({
    totalUsers: "—",
    totalTasks: "—",
    totalRevenue: "—",
    activeTasks: "—",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activities, setActivities] = useState([]);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const diff = Date.now() - date.getTime();
    const minutes = Math.round(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.round(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  };

  useEffect(() => {
    let active = true;
   const fetchOverview = async () => {
  try {
    setLoading(true);

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

    // Fetch protected routes
    const [overviewRes, activityRes] = await Promise.all([
      fetch(`${serverUrl}/api/admin/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(`${serverUrl}/api/admin/activity`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    if (!overviewRes.ok) throw new Error("Unable to load overview data.");
    if (!activityRes.ok) throw new Error("Unable to load activity feed.");

    const overviewData = await overviewRes.json();
    const activityData = await activityRes.json();

    if (!active) return;

    setStats({
      totalUsers: overviewData.totalUsers?.toLocaleString() ?? "0",
      totalTasks: overviewData.totalTasks?.toLocaleString() ?? "0",
      totalRevenue: `$${overviewData.totalRevenue?.toLocaleString() ?? "0"}`,
      activeTasks: overviewData.activeTasks?.toLocaleString() ?? "0",
    });

    setActivities(
      activityData.map((activity) => ({
        ...activity,
        time: formatRelativeTime(activity.timestamp),
      }))
    );
  } catch (err) {
    if (!active) return;
    setError(err.message || "Failed to load admin dashboard data.");
  } finally {
    if (!active) return;
    setLoading(false);
  }
};

    fetchOverview();
    return () => {
      active = false;
    };
  }, [serverUrl]);

  if (error) {
    return (
      <div className="min-h-[60vh] bg-white border border-black/10 p-10 rounded-none select-none">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Admin Overview</h1>
        <p className="mt-4 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 select-none">
      <div className="border-b border-black/10 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
            Admin Overview
          </h1>
          <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
            SkillSwap Central Command
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-black hover:bg-black/90 text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 rounded-none cursor-pointer border border-black self-start sm:self-auto"
        >
          Refresh Overview
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Total Users</span>
            <span className="text-[10px] font-bold tracking-tight text-black/60 block">active registered accounts</span>
          </div>
          <span className="text-4xl font-black text-black tracking-tighter leading-none mt-4">
            {loading ? "..." : stats.totalUsers}
          </span>
        </div>

        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Total Tasks</span>
            <span className="text-[10px] font-bold tracking-tight text-black/60 block">globally listed tasks</span>
          </div>
          <span className="text-4xl font-black text-black tracking-tighter leading-none mt-4">
            {loading ? "..." : stats.totalTasks}
          </span>
        </div>

        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Total Revenue</span>
            <span className="text-[10px] font-bold tracking-tight text-black/60 block">processed billing volume</span>
          </div>
          <span className="text-3xl font-black text-black tracking-tighter leading-none mt-4">
            {loading ? "..." : stats.totalRevenue}
          </span>
        </div>

        <div className="bg-black text-white p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase block mb-1">Active Tasks</span>
            <span className="text-[10px] font-bold tracking-tight text-white/60 block">tasks currently live</span>
          </div>
          <span className="text-3xl font-black text-white tracking-tighter leading-none mt-4">
            {loading ? "..." : stats.activeTasks}
          </span>
        </div>
      </div>

      <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none">
        <h2 className="text-sm font-black tracking-widest text-black uppercase border-b border-black/10 pb-4 mb-6">
          Recent Platform Activity
        </h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="border-l-4 border-black pl-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-black/1 transition-colors"
            >
              <div>
                <h4 className="text-xs font-black uppercase tracking-tight text-black">
                  {activity.title}
                </h4>
                <p className="text-[10px] font-medium text-black/50 uppercase mt-0.5">
                  {activity.detail}
                </p>
              </div>
              <span className="text-[9px] font-bold tracking-wider text-black/40 uppercase self-start sm:self-auto">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
