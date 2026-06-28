"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function TopFreelancers() {

  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/freelancers`);
        if (!res.ok) throw new Error("Failed to load top freelancers");

        const data = await res.json();

        const mapped = data
          .slice(0, 3)
          .map((freelancer) => ({
            id: freelancer._id?.$oid || freelancer._id || freelancer.id,
            name: freelancer.name || "Freelancer",
            avatarUrl: freelancer.image,
            finishedJobs: Number(freelancer.finishedJobs || freelancer.completedJobs || 0),
            skills: Array.isArray(freelancer.skills)
              ? freelancer.skills
              : (freelancer.skills || "").split(",").map((skill) => skill.trim()).filter(Boolean),
          }));

        setFreelancers(mapped);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  return (
    <section className="bg-white py-20 px-6 md:px-16 lg:px-24 select-none">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-black uppercase mb-16">
          Top Freelancers
        </h2>

        {loading && (
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-black/40">
            Loading top freelancers...
          </div>
        )}

        {error && (
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-red-600">
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8 text-center">
            {freelancers.map((freelancer) => (
              <div key={freelancer.id} className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border border-black/20 p-1 mb-4 flex items-center justify-center">
                  <Image
                    src={freelancer.avatarUrl}
                    alt={freelancer.name}
                    className="w-full h-full object-cover rounded-full filter grayscale contrast-125"
                    width={112}
                    height={112}
                  />
                </div>

                <h3 className="text-lg font-bold text-black mb-1">{freelancer.name}</h3>

                <div className="flex items-center justify-center gap-1 text-xs text-black/50 mb-6 font-normal">
                  <span className="text-black font-bold">☆5</span>
                  <span>({freelancer.finishedJobs} tasks)</span>
                </div>

                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-medium text-black/60 mb-8">
                  {freelancer.skills.length > 0 ? (
                    freelancer.skills.map((skill, index) => (
                      <span className="bg-gray-200 px-2 py-1 rounded-sm" key={`${freelancer.id}-${index}`}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-black/40">No skills listed</span>
                  )}
                </div>

                <Link href={`/freelancer/${freelancer.id}`}>
                  <button className="text-[10px] font-bold tracking-[0.2em] text-black/70 uppercase hover:text-black border-b border-transparent hover:border-black transition-all pb-0.5 cursor-pointer">
                    Hire Directly
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TopFreelancers;
