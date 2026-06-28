"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ExpertNetwork() {
  const [freelancers, setFreelancers] = useState([]);
  const [error, setError] = useState("");

  // Fetch freelancer listings from the backend on component mount.
  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/freelancers`);
        if (!res.ok) throw new Error("Failed to pull marketplace directory");
        const data = await res.json();
        
        // Filter out client profiles, leaving only users with the freelancer role
        const onlyFreelancers = data.filter((user) => user.role === "freelancer");
        setFreelancers();
      } catch (err) {
        setError(err.message || "Something went wrong.");
      }
    };

    fetchFreelancers();
  }, []);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-12 text-xs font-bold tracking-widest text-red-600 uppercase">
        ⚠️ Error: {error}
      </div>
    );
  }

  return (
    <section className="w-full mt-10 md:mt-15 py-16 select-none font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-[44px] font-black tracking-tighter uppercase text-black leading-none mb-3">
            Expert Freelancers
          </h2>
          <p className="text-sm font-medium text-black/50 tracking-tight">
            Connect with top-tier professionals for your next technical project.
          </p>
        </div>

        {/* Brutalist Grid */}
        {freelancers.length === 0 ? (
          <div className="bg-white border border-black/10 p-12 text-center text-sm font-semibold text-black/40 uppercase tracking-wider">
            No active experts found in the network.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {freelancers.map((freelancer) => {
              const firstLetter = freelancer.name ? freelancer.name.charAt(0).toUpperCase() : "?";
              const freelancerId = freelancer._id?.$oid || freelancer._id || freelancer.id;

              return (
                <Link key={freelancerId} href={`/freelancers/${freelancerId}`}>
                  <div className="bg-white border border-black/10 p-6 shadow-sm hover:border-black/30 transition-colors duration-200 flex flex-col justify-between relative h-full group">
                    
                    {/* Upper Deck: Profile Meta & Rates */}
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        
                        {/* Avatar Logic Block */}
                        {freelancer.image ? (
                          <Image 
                            src={freelancer.image} 
                            alt={freelancer.name} 
                            width={56}
                            height={56}
                            className="w-14 h-14 object-cover grayscale border border-black/10 rounded-none"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-black text-white flex items-center justify-center font-black text-xl rounded-none tracking-tighter">
                            {firstLetter}
                          </div>
                        )}

                        {/* Price Tag Badge */}
                        <span className="bg-black text-white text-[10px] font-black tracking-wider px-2 py-1 uppercase rounded-none">
                          ${freelancer.hourlyRate || "0"}/hr
                        </span>
                      </div>

                      {/* Identity Block */}
                      <div className="mb-3">
                        <h3 className="text-lg font-black tracking-tight text-black leading-snug">
                          {freelancer.name}
                        </h3>
                        <p className="text-[10px] font-bold tracking-widest text-black/40 uppercase mt-0.5">
                          {freelancer.title || "Full-Stack Architect"}
                        </p>
                      </div>

                      {/* Professional Description */}
                      <p className="text-xs text-black/70 leading-relaxed tracking-tight mb-6 line-clamp-3">
                        {freelancer.description || "No description provided."}
                      </p>
                    </div>

                    {/* Lower Deck: Brutalist Skill Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-black/15">
                      {freelancer.skills && freelancer.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-[#F5F5F5] border border-black/5 text-black/60 text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded-none"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}
        
      </div>
    </section>
  );
}