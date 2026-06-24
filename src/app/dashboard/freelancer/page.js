"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function FreelancerDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Exact values from the second panel of the mockup image
  const stats = {
    totalProposals: 28,
    activeProposals: 12,
    acceptedProposals: 6,
    totalEarnings: "$8.4k"
  };

  return (
    <div className="space-y-10 select-none">
      
      {/* Header Deck */}
      <div className="border-b border-black/10 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
            Freelancer Overview
          </h1>
          <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
            Active Workspace Operations
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
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Total Proposals</span>
            <span className="text-[10px] font-bold tracking-tight text-black/60 block">submitted application bids</span>
          </div>
          <span className="text-4xl font-black text-black tracking-tighter leading-none mt-4">
            {stats.totalProposals}
          </span>
        </div>

        {/* Active Proposals */}
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Active Proposals</span>
            <span className="text-[10px] font-bold tracking-tight text-black/60 block">pending client review</span>
          </div>
          <span className="text-4xl font-black text-black tracking-tighter leading-none mt-4">
            {stats.activeProposals}
          </span>
        </div>

        {/* Accepted Proposals */}
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase block mb-1">Accepted Proposals</span>
            <span className="text-[10px] font-bold tracking-tight text-black/60 block">hired & active projects</span>
          </div>
          <span className="text-4xl font-black text-black tracking-tighter leading-none mt-4">
            {stats.acceptedProposals}
          </span>
        </div>

        {/* Total Earnings */}
        <div className="bg-black text-white p-6 shadow-sm flex flex-col justify-between min-h-36 rounded-none">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase block mb-1">Total Earnings</span>
            <span className="text-[10px] font-bold tracking-tight text-white/60 block">withdrawn / lifetime volume</span>
          </div>
          <span className="text-3xl font-black text-white tracking-tighter leading-none mt-4">
            {stats.totalEarnings}
          </span>
        </div>

      </div>

      {/* Recent Activity Blueprint Canvas */}
      <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none">
        <h2 className="text-sm font-black tracking-widest text-black uppercase border-b border-black/10 pb-4 mb-6">
          Recent Activity Blueprint
        </h2>
        
        {/* Gray Blueprint box mimicking screenshot */}
        <div className="bg-[#EAEAEA] border border-black/5 p-12 text-center flex flex-col items-center justify-center min-h-80 rounded-none select-none">
          <div className="w-10 h-10 bg-white border border-black/10 flex items-center justify-center text-lg mb-4 shadow-sm">
            📊
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-black uppercase block mb-1">
            Activity Matrix Monitor
          </span>
          <span className="text-[9px] font-bold tracking-wider text-black/40 uppercase block max-w-sm leading-relaxed">
            Visualizing active proposals, project milestones, and running payment nodes.
          </span>
        </div>
      </div>

    </div>
  );
}
