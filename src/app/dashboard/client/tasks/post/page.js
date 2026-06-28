"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";


export default function PostTaskPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const categories = [
    "Web Development",
    "Design & Creative",
    "Writing & Translation",
    "Data Science",
    "Cybersecurity",
    "DevOps",
    "Legal",
    "Business & Finance",
    "Marketing",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    const formData = new FormData(e.currentTarget);
    if (!session) {
      setError("Please sign in before creating a task.");
      setLoading(false);
      return;
    }

    const payload = {
      title: formData.get("title"),
      category: formData.get("category"),
      budget: parseFloat(formData.get("budget")),
      description: formData.get("description"),
      deadline: formData.get("deadline"),
      client_email: session.user.email,
      client_name: session.user.name,
      client_image: session.user.image,
    };

    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

      const tokenResponse = await authClient.token();
      if (tokenResponse.error) {
        throw new Error(tokenResponse.error.message || "Failed to retrieve auth token.");
      }

      const token = tokenResponse.data?.token;
      if (!token) {
        throw new Error("Failed to retrieve auth token.");
      }

      const res = await fetch(`${serverUrl}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create task.");
      }

      setSuccess("Task listed successfully in global registry.");
      e.target.reset();

      // Redirect to client overview after brief delay
      setTimeout(() => {
        router.push("/dashboard/client");
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 select-none">
      {/* Header Deck */}
      <div className="border-b border-black/10 pb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
          Post a Task
        </h1>
        <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
          Define your requirements to find the right talent quickly.
        </p>
      </div>

      {/* Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Side: Form */}
        <div className="lg:col-span-2 bg-white border border-black/10 p-8 shadow-sm rounded-none">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-250 text-green-755 text-xs font-bold uppercase tracking-wider">
              ✓ {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
                Task Title
              </label>
              <input
                name="title"
                type="text"
                placeholder="e.g. Develop a React Frontend for E-commerce"
                className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20"
                required
              />
            </div>

            {/* Category & Budget Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full border border-black/20 bg-white px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none cursor-pointer"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
                  Budget (USD)
                </label>
                <input
                  name="budget"
                  type="number"
                  placeholder="e.g. 1500"
                  min="1"
                  className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
                Description
              </label>
              <textarea
                name="description"
                rows={6}
                placeholder="Provide a detailed description of the task, requirements, and deliverables..."
                className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none resize-none placeholder-black/20"
                required
              />
            </div>

            {/* Deadline */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
                Deadline
              </label>
              <input
                name="deadline"
                type="date"
                className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-black/90 text-white px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-200 rounded-none cursor-pointer border border-black disabled:bg-black/40 disabled:cursor-not-allowed"
            >
              {loading ? "Posting..." : "Post the Task"}
            </button>
          </form>
        </div>

        {/* Right Side: Tips */}
        <div className="space-y-6">
          {/* Tip Card 1 */}
          <div className="bg-white border border-black/10 p-6 shadow-sm rounded-none">
            <h3 className="text-xs font-black tracking-widest text-black uppercase border-b border-black/10 pb-3 mb-4 flex items-center gap-2">
              <span>💡</span> Tip: Tune standard metrics
            </h3>
            <ul className="text-[11px] text-black/60 space-y-3 list-disc list-inside leading-relaxed">
              <li>Be specific about deliverables to avoid scope creep.</li>
              <li>Set a realistic budget based on market rates.</li>
              <li>Clearly define required skills or software.</li>
            </ul>
          </div>

          {/* Tip Card 2 */}
          <div className="bg-white border border-black/10 p-6 shadow-sm rounded-none">
            <h3 className="text-xs font-black tracking-widest text-black uppercase border-b border-black/10 pb-3 mb-4 flex items-center gap-2">
              <span>⚡</span> Tip: Maximize bids asset
            </h3>
            <p className="text-[11px] text-black/60 leading-relaxed">
              Tasks with comprehensive descriptions receive{" "}
              <strong className="text-black">80% more proposals</strong> from
              top-rated talent within the first 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
