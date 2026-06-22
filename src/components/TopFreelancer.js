const freelancersData = [
  {
    id: "1",
    name: "Sarah Jenkins",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 4.9,
    finishedJobs: 142,
    skills: ["React", "Node.js", "APIs"],
  },
  {
    id: "2",
    name: "Marcus Vance",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5.0,
    finishedJobs: 89,
    skills: ["Copywriting", "Technical SEO"],
  },
  {
    id: "3",
    name: "Eliot Vance",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 4.8,
    finishedJobs: 215,
    skills: ["UI/UX", "Figma", "Branding"],
  },
];

function TopFreelancers() {
  return (
    <section className="bg-white py-20 px-6 md:px-16 lg:px-24 select-none">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-black uppercase mb-16">
          Top Freelancers
        </h2>

        {/* Centered Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8 text-center">
          {freelancersData.map((freelancer) => (
            <div key={freelancer.id} className="flex flex-col items-center">
              {/* Profile Image Wrap (Stylized to B&W round portrait) */}
              <div className="w-28 h-28 rounded-full overflow-hidden border border-black/20 p-1 mb-4 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={freelancer.avatarUrl}
                  alt={freelancer.name}
                  className="w-full h-full object-cover rounded-full filter grayscale contrast-125"
                />
              </div>

              {/* Freelancer Name */}
              <h3 className="text-lg font-bold text-black mb-1">
                {freelancer.name}
              </h3>

              {/* Star Rating & Completed Jobs */}
              <div className="flex items-center justify-center gap-1 text-xs text-black/50 mb-6 font-normal">
                <span className="text-black font-bold">
                  ☆ {freelancer.rating.toFixed(1)}
                </span>
                <span>({freelancer.finishedJobs} tasks)</span>
              </div>

              {/* Skills Tags row */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-medium text-black/60 mb-8">
                {freelancer.skills.map((skill, index) => (
                  <span
                    className="bg-gray-200 px-2 py-1 rounded-sm"
                    key={index}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Direct Call To Action */}
              <button className="text-[10px] font-bold tracking-[0.2em] text-black/70 uppercase hover:text-black border-b border-transparent hover:border-black transition-all pb-0.5 cursor-pointer">
                Hire Directly
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopFreelancers;
