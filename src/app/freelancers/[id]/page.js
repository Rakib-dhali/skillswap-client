"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FreelancerDetailsPage() {
  const { id } = useParams(); // Grabs the dynamic user ID string from the browser route
  
  const [freelancer, setFreelancer] = useState(null);
  const [error, setError] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchFreelancerProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/freelancers/${id}`);
        if (!res.ok) throw new Error("Freelancer profile could not be found.");
        const data = await res.json();
        setFreelancer(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      }
    };

    fetchFreelancerProfile();
  }, [id]);

  const handleHireInvitation = async (e) => {
    e.preventDefault();
    alert("THIS FEATURE IS NOT AVAILABLE YET");
  };

  if (error || !freelancer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs font-bold tracking-widest text-red-600 uppercase bg-[#F5F5F5]">
        ⚠️ Error: {error || "Profile data unavailable."}
      </div>
    );
  }

  const firstLetter = freelancer.name ? freelancer.name.charAt(0).toUpperCase() : "?";

  return (
    <main className="min-h-screen py-12 select-none font-sans bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Upper Architecture: Identity Card Stack */}
        <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar Module */}
            {freelancer.image ? (
              <Image
                src={freelancer.image} 
                alt={freelancer.name} 
                height={80}
                width={80}
                className="object-cover grayscale border border-black/10 rounded-none w-20 h-20"
              />
            ) : (
              <div className="w-20 h-20 bg-black text-white flex items-center justify-center font-black text-3xl rounded-none tracking-tighter">
                {firstLetter}
              </div>
            )}

            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-black uppercase leading-none mb-2">
                {freelancer.name}
              </h1>
              <p className="text-xs font-bold tracking-widest text-black/50 uppercase">
                {freelancer.title || "Technical Specialist"}
              </p>
            </div>
          </div>

          {/* Pricing Highlight Tag */}
          <div className="bg-black text-white px-4 py-3 text-center rounded-none self-stretch sm:self-auto flex flex-col justify-center min-w-32">
            <span className="text-[8px] font-bold tracking-widest text-white/50 uppercase block mb-0.5">Hourly Rate</span>
            <span className="text-lg font-black tracking-tighter">${freelancer.rate || "0"}/hr</span>
          </div>
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT DECK: Profile Core Bio & Technical Stack */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Biography Details */}
            <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none">
              <h2 className="text-sm font-black tracking-widest text-black uppercase border-b border-black/10 pb-4 mb-6">
                Professional Statement
              </h2>
              <p className="text-xs text-black/80 leading-relaxed tracking-tight whitespace-pre-wrap">
                {freelancer.bio || "No biography provided by this professional yet."}
              </p>
            </div>

            {/* Technical Tooling & Skill Badges Block */}
            <div className="bg-white border border-black/10 p-8 shadow-sm rounded-none">
              <h2 className="text-sm font-black tracking-widest text-black uppercase border-b border-black/10 pb-4 mb-6">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills && freelancer.skills.length > 0 ? (
                  freelancer.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="bg-[#F5F5F5] border border-black/10 text-black/80 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-none"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-black/30 italic uppercase">No skillset listed.</span>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT DECK: Work Direct Hire / Inquiry Pitch Form */}
          <div className="space-y-6">
            
            <div className="bg-white border border-black/10 p-6 shadow-sm rounded-none">
              <h3 className="text-xs font-black tracking-widest text-black uppercase border-b border-black/10 pb-4 mb-4">
                Hire Directly
              </h3>

              {successMsg && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold tracking-wider uppercase">
                  ✓ {successMsg}
                </div>
              )}

              <form onSubmit={handleHireInvitation} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold tracking-widest text-black/50 uppercase">
                    Select Your Open Task
                  </label>
                  <select 
                    name="taskSelection"
                    className="w-full border border-black/20 bg-white px-3 py-2.5 text-xs text-black focus:outline-none focus:border-black rounded-none appearance-none cursor-pointer"
                    required
                  >
                    <option value="">-- Choose Active Workspace Task --</option>
                    <option value="task_01">E-commerce Analytics Dashboard Implementation</option>
                    <option value="task_02">React Component System Architecture</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold tracking-widest text-black/50 uppercase">
                    Message Pitch
                  </label>
                  <textarea 
                    name="offerMessage"
                    rows={5}
                    placeholder="Briefly describe the milestones and project specs..." 
                    className="w-full border border-black/20 px-3 py-2.5 text-xs text-black focus:outline-none focus:border-black rounded-none resize-none placeholder-black/20"
                    required 
                  />
                </div>

                <button 
                  type="submit"
                  disabled={inviteLoading}
                  className="w-full bg-black text-white text-[11px] font-bold uppercase tracking-[0.15em] py-3 mt-2 hover:bg-black/90 transition-colors cursor-pointer disabled:bg-black/40 rounded-none"
                >
                  {inviteLoading ? "Sending Offer..." : "Send Work Proposal"}
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}