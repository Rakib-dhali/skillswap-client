"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Exact values from the fourth panel of the mockup image
  const stats = {
    totalUsers: "1,240",
    totalTasks: "3,500",
    totalRevenue: "$125K",
    systemStatus: "450"
  };

  const activities = [
    {
      id: "1",
      type: "TASK_CREATED",
      title: "New Task Created: UI/Design for Fintech App",
      detail: "Client: Sofia Chen — Amount: $1,200",
      time: "12 min ago"
    },
    {
      id: "2",
      type: "PAYMENT",
      title: "Payment Processed: Milestone 1",
      detail: "USD $450 — Task ID: next-auth-setup",
      time: "44 min ago"
    },
    {
      id: "3",
      type: "USER_REGISTERED",
      title: "New User Registration: Rohit",
      detail: "Role: Freelancer — React Developer",
      time: "2 hours ago"
    }
  ];

  return (
    <div className="space-y-10 select-none">
      
      {/* Header Deck */}
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
          onClick={() => alert("Platform report compiled.")}
          className="bg-black hover:bg-black/90 text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 rounded-none cursor-pointer border border-black self-start sm:self-auto"
        >
          Generate Report
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Total Users</span>
            <span className="text-[10px] font-bold tracking-tight text-black/60 block">active registered accounts</span>
          </div>
          <span className="text-4xl font-black text-black tracking-tighter leading-none mt-4">
            {stats.totalUsers}
          </span>
        </div>

        {/* Total Tasks */}
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Total Tasks</span>
            <span className="text-[10px] font-bold tracking-tight text-black/60 block">globally listed tasks</span>
          </div>
          <span className="text-4xl font-black text-black tracking-tighter leading-none mt-4">
            {stats.totalTasks}
          </span>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Total Revenue</span>
            <span className="text-[10px] font-bold tracking-tight text-black/60 block">processed billing volume</span>
          </div>
          <span className="text-3xl font-black text-black tracking-tighter leading-none mt-4">
            {stats.totalRevenue}
          </span>
        </div>

        {/* System Status (Black Card) */}
        <div className="bg-black text-white p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase block mb-1">System Status</span>
            <span className="text-[10px] font-bold tracking-tight text-white/60 block">running worker nodes</span>
          </div>
          <span className="text-3xl font-black text-white tracking-tighter leading-none mt-4">
            {stats.systemStatus}
          </span>
        </div>

      </div>

      {/* Recent Platform Activity Logger */}
      <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none">
        <h2 className="text-sm font-black tracking-widest text-black uppercase border-b border-black/10 pb-4 mb-6">
          Recent Platform Activity
        </h2>
        
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="border-l-4 border-black pl-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-black/[0.01] transition-colors"
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
