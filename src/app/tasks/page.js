"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function BrowseTasks() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Read directly from URL search parameters (Single Source of Truth)
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";
  const urlMinBudget = searchParams.get("minBudget") || "";
  const urlSortBy = searchParams.get("sortBy") || "newest";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  // 2. Track the search string locally
  const [search, setSearch] = useState(urlSearch);
  
  // 3. Sync state during render if browser's back/forward navigation alters URL
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  if (urlSearch !== prevUrlSearch) {
    setSearch(urlSearch);
    setPrevUrlSearch(urlSearch);
  }

  // Core Data States
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    "All Categories",
    "Web Development",
    "Design & Creative",
    "Writing & Translation",
    "Data Science",
    "Cybersecurity",
    "DevOps",
    "Legal",
    "Business & Finance",
    "Marketing"
  ];

  const updateUrlParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === "All" || value === "All Categories") {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const queryParams = new URLSearchParams({
          search: urlSearch,
          category: urlCategory,
          minBudget: urlMinBudget,
          sortBy: urlSortBy,
          page: urlPage.toString()
        });

        const res = await fetch(`http://localhost:5000/api/tasks?${queryParams}`);
        if (!res.ok) throw new Error("Failed to fetch tasks directory.");
        
        const data = await res.json();
        setTasks(data.tasks || []); 
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTasks();
  }, [urlSearch, urlCategory, urlMinBudget, urlSortBy, urlPage]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const targetMinBudget = e.target.elements.minBudget.value;
    updateUrlParams({
      search,
      minBudget: targetMinBudget,
      page: 1 
    });
  };

  const handleCategoryChange = (newCat) => {
    updateUrlParams({ category: newCat, page: 1 });
  };

  const handleSortChange = (newSort) => {
    updateUrlParams({ sortBy: newSort, page: 1 });
  };

  const clearCategoryFilter = () => {
    updateUrlParams({ category: "All", page: 1 });
  };

  const clearBudgetFilter = () => {
    updateUrlParams({ minBudget: "", page: 1 });
  };

  const clearAllFilters = () => {
    setSearch("");
    router.push("?"); 
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-12 text-xs font-bold tracking-widest text-red-600 uppercase">
        ⚠️ Error: {error}
      </div>
    );
  }

  return (
    <section className="w-full bg-[#F5F5F5] min-h-screen py-16 font-sans select-none text-black">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        <div className="mb-10">
          <h1 className="text-4xl md:text-[44px] font-black tracking-tighter uppercase leading-none mb-3">
            Browse Tasks
          </h1>
          <p className="text-sm font-medium text-black/50 tracking-tight max-w-2xl">
            Find micro-tasks that match your skills. Filter by category, set your budget range, and start working immediately.
          </p>
        </div>

        <form onSubmit={handleApplyFilters} className="bg-white border border-black/10 p-6 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-2/5 flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black/40 uppercase">Keywords</label>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-black/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-black/20 font-medium text-sm rounded-none focus:outline-none focus:border-black/50 placeholder:text-black/30"
              />
            </div>
          </div>

          <div className="w-full md:w-1/4 flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black/40 uppercase">Category</label>
            <select
              value={urlCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-black/20 font-medium text-sm rounded-none bg-white focus:outline-none focus:border-black/50 appearance-none cursor-pointer"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"3\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M19 9l-7 7-7-7\"/></svg>')", backgroundPosition: "calc(100% - 12px) center", backgroundRepeat: "no-repeat" }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/5 flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black/40 uppercase">Min Budget</label>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-black/40 text-sm font-medium">$</span>
              <input
                type="number"
                name="minBudget"
                placeholder="0"
                defaultValue={urlMinBudget}
                key={urlMinBudget}
                className="w-full pl-7 pr-3 py-2 border border-black/20 font-medium text-sm rounded-none focus:outline-none focus:border-black/50 placeholder:text-black/30"
              />
            </div>
          </div>

          <div className="w-full md:w-1/5 flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black/40 uppercase">Sort By</label>
            <select
              value={urlSortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-black/20 font-medium text-sm rounded-none bg-white focus:outline-none focus:border-black/50"
            >
              <option value="newest">Newest Listed</option>
              <option value="highest-budget">Highest Budget</option>
              <option value="lowest-budget">Lowest Budget</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto bg-black text-white px-6 py-2.5 font-bold text-xs uppercase tracking-wider rounded-none hover:bg-black/80 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 mb-8 min-h-6.5">
          {(urlCategory !== "All" && urlCategory !== "All Categories") && (
            <span className="bg-white border border-black/10 text-black/70 text-[10px] font-bold font-mono px-2 py-1 flex items-center gap-1.5">
              {urlCategory}
              <button type="button" onClick={clearCategoryFilter} className="hover:text-black font-black text-black/40">×</button>
            </span>
          )}

          {urlMinBudget && (
            <span className="bg-white border border-black/10 text-black/70 text-[10px] font-bold font-mono px-2 py-1 flex items-center gap-1.5">
              Budget: &gt; ${urlMinBudget}
              <button type="button" onClick={clearBudgetFilter} className="hover:text-black font-black text-black/40">×</button>
            </span>
          )}

          {((urlCategory !== "All" && urlCategory !== "All Categories") || urlMinBudget || urlSearch) && (
            <button
              onClick={clearAllFilters}
              className="text-[10px] font-bold font-mono tracking-tight text-black/40 underline decoration-dotted underline-offset-4 hover:text-black ml-1"
            >
              Clear All
            </button>
          )}
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white border border-black/10 p-12 text-center text-sm font-semibold text-black/40 uppercase tracking-wider">
            No matching tasks found. Adjust filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {tasks.map((task, index) => {
              const letterCode = task.client_email ? task.client_email.charAt(0).toUpperCase() : "C";
              const taskKey = task._id?.$oid || task._id || `task-fallback-key-${index}`;

              return (
               <Link key={taskKey} href={`/tasks/${task._id}`}>
                <div className="bg-white border border-black/10 p-6 shadow-sm hover:border-black/30 transition-colors duration-200 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-xl font-black tracking-tight text-black leading-snug hover:underline cursor-pointer">
                        {task.title}
                      </h3>
                      <span className="bg-black text-white text-[10px] font-mono font-black tracking-wide px-2 py-0.5 whitespace-nowrap">
                        ${task.budget} Fixed
                      </span>
                    </div>
                    <p className="text-xs text-black/70 leading-relaxed tracking-tight mb-6 line-clamp-2">
                      {task.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-black/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-black text-white flex items-center justify-center font-black text-[10px]">
                        {letterCode}
                      </div>
                      <span className="text-xs font-black tracking-tight text-black truncate max-w-45">
                        {task.client_email?.split("@")[0]}
                      </span>
                    </div>
                    <span className="bg-[#F5F5F5] border border-black/5 text-black/50 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                      {task.category?.split(" ")[0] || "Task"}
                    </span>
                  </div>
                </div>
               </Link>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 font-mono text-xs">
            <button
              disabled={urlPage === 1}
              onClick={() => updateUrlParams({ page: Math.max(urlPage - 1, 1) })}
              className="w-8 h-8 bg-white border border-black/10 flex items-center justify-center font-bold hover:bg-[#F5F5F5] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={`page-btn-${pageNum}`}
                  onClick={() => updateUrlParams({ page: pageNum })}
                  className={`w-8 h-8 font-bold flex items-center justify-center transition-colors border ${
                    urlPage === pageNum
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-black/10 hover:bg-[#F5F5F5]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={urlPage === totalPages}
              onClick={() => updateUrlParams({ page: Math.min(urlPage + 1, totalPages) })}
              className="w-8 h-8 bg-white border border-black/10 flex items-center justify-center font-bold hover:bg-[#F5F5F5] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              &gt;
            </button>
          </div>
        )}

      </div>
    </section>
  );
}