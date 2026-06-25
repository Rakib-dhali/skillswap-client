"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function FreelancerProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    image: "",
    skills: "",
    bio: "",
    hourlyRate: "",
  });

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user?.email) return;

    let active = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${serverUrl}/api/freelancers/profile/${encodeURIComponent(user.email)}`
        );
        if (!res.ok) throw new Error("Failed to load profile.");
        const data = await res.json();
        
        if (active) {
          setProfile({
            name: data.name || "",
            image: data.image || "",
            skills: Array.isArray(data.skills) ? data.skills.join(", ") : (data.skills || ""),
            bio: data.bio || "",
            hourlyRate: data.hourlyRate || "",
          });
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, [user?.email, serverUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      // Process skills into array
      const skillsArray = profile.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        name: profile.name,
        image: profile.image,
        skills: skillsArray,
        bio: profile.bio,
        hourlyRate: Number(profile.hourlyRate),
      };

      const res = await fetch(
        `${serverUrl}/api/freelancers/profile/${encodeURIComponent(user.email)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to update profile.");
      
      setSuccess("Profile updated successfully!");
      
      // Update session info if client-side cached
      // (Note: Better Auth session can be refreshed or re-fetched if name/image changed)
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-10 select-none">
        <div className="border-b border-black/10 pb-8">
          <div className="h-10 w-72 bg-black/5 animate-pulse mb-3"></div>
          <div className="h-4 w-56 bg-black/5 animate-pulse"></div>
        </div>
        <div className="max-w-2xl bg-white border border-black/10 p-8 rounded-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2 mb-4 animate-pulse">
              <div className="h-3 w-28 bg-black/5"></div>
              <div className="h-10 w-full bg-black/5"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 select-none">
      {/* Header */}
      <div className="border-b border-black/10 pb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
          Edit Profile
        </h1>
        <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
          Manage your public freelancer persona
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl bg-white border border-black/10 p-8 shadow-sm rounded-none">
        <h2 className="text-sm font-black tracking-widest text-black uppercase border-b border-black/10 pb-4 mb-6">
          Profile Details
        </h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-bold tracking-wider uppercase">
            ✓ {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-bold tracking-wider uppercase">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="e.g. Alex Rivera"
              required
              className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20"
            />
          </div>

          {/* Photo URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
              Photo URL
            </label>
            <input
              type="url"
              name="image"
              value={profile.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20"
            />
          </div>

          {/* Hourly Rate */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
              Hourly Rate ($ USD / hour)
            </label>
            <input
              type="number"
              name="hourlyRate"
              value={profile.hourlyRate}
              onChange={handleChange}
              placeholder="55"
              required
              min="1"
              className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20"
            />
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="React, Next.js, Node.js, TailWindCSS"
              className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
              Professional Bio
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={6}
              placeholder="Tell clients about your expertise, background, and what you build..."
              className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none resize-none placeholder-black/20"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-black hover:bg-black/90 text-white py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors border border-black cursor-pointer disabled:bg-black/40 disabled:cursor-not-allowed mt-4"
          >
            {saving ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </form>
      </div>
    </div>
  );
}
