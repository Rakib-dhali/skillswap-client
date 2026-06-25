"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function FreelancerDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState({
    totalProposals: 0,
    pending: 0,
    accepted: 0,
    totalEarnings: 0,
  });
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState("");
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "just now";
    const date = new Date(timestamp);
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
    if (user?.email) {
      fetch(
        `${serverUrl}/api/freelancer/stats/${encodeURIComponent(user.email)}`
      )
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch(console.error);
    }
  }, [user?.email, serverUrl]);

  useEffect(() => {
    let active = true;

    const fetchActivity = async () => {
      if (!user?.email) return;
      setActivityLoading(true);
      try {
        const response = await fetch(
          `${serverUrl}/api/freelancer/activity/${encodeURIComponent(user.email)}`
        );
        if (!response.ok) {
          throw new Error("Unable to load activity feed.");
        }
        const data = await response.json();
        if (!active) return;
        setActivities(data);
      } catch (error) {
        if (!active) return;
        setActivityError(error.message || "Unable to load activity feed.");
      } finally {
        if (!active) return;
        setActivityLoading(false);
      }
    };

    fetchActivity();
    return () => {
      active = false;
    };
  }, [user?.email, serverUrl]);

  return (
    <div className="space-y-10 select-none">
      {/* Header Deck */}
      <div className="border-b border-black/10 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
            Freelancer Overview
          </h1>
          <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
            {user?.name ? `${user.name}'s Workspace` : "Active Workspace Operations"}
          </p>
        </div>
        <span className="text-[10px] font-bold tracking-widest bg-black text-white px-3 py-1.5 uppercase rounded-none self-start sm:self-auto">
          Online
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Proposals */}
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">
              Total Proposals
            </span>
            <span className="text-[10px] font-bold tracking-tight text-black/60 block">
              submitted application bids
            </span>
          </div>
          <span className="text-4xl font-black text-black tracking-tighter leading-none mt-4">
            {stats.totalProposals}
          </span>
        </div>

        {/* Pending Proposals */}
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">
              Pending Proposals
            </span>
            <span className="text-[10px] font-bold tracking-tight text-black/60 block">
              pending client review
            </span>
          </div>
          <span className="text-4xl font-black text-black tracking-tighter leading-none mt-4">
            {stats.pending}
          </span>
        </div>

        {/* Accepted Proposals */}
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">
              Accepted Proposals
            </span>
            <span className="text-[10px] font-bold tracking-tight text-black/60 block">
              hired & active projects
            </span>
          </div>
          <span className="text-4xl font-black text-black tracking-tighter leading-none mt-4">
            {stats.accepted}
          </span>
        </div>

        {/* Total Earnings */}
        <div className="bg-black text-white p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase block mb-1">
              Total Earnings
            </span>
            <span className="text-[10px] font-bold tracking-tight text-white/60 block">
              lifetime payment volume
            </span>
          </div>
          <span className="text-3xl font-black text-white tracking-tighter leading-none mt-4">
            ${stats.totalEarnings}
          </span>
        </div>
      </div>

      {/* Recent Activity Canvas */}
      <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none">
        <h2 className="text-sm font-black tracking-widest text-black uppercase border-b border-black/10 pb-4 mb-6">
          Recent Activity
        </h2>

        {activityLoading ? (
          <div className="text-center text-[10px] uppercase tracking-[0.35em] text-black/40 py-10">
            Loading activity...
          </div>
        ) : activityError ? (
          <div className="text-center text-[10px] text-red-600 uppercase tracking-[0.35em] py-10">
            {activityError}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-[10px] uppercase tracking-[0.35em] text-black/40 py-10">
            No recent activity yet.
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="border-l-4 border-black pl-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-black/5 transition-colors"
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
        )}
      </div>
    </div>
  );
}
