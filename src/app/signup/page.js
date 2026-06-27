"use client";

import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/imageUpload";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedRole, setSelectedRole] = useState("client"); // Default tracking local state
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const redirectByRole = async () => {
    try {
      const { data } = await authClient.getSession();
      const role = data?.user?.role || "client";

      if (role === "client") {
        router.push("/");
      } else if (role === "freelancer") {
        router.push("/dashboard/freelancer");
      } else if (role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      router.push("/");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setUploadingPhoto(true);

    try {
      const uploadedUrl = await uploadImage(file);
      setPhotoUrl(uploadedUrl);
    } catch (err) {
      setErrorMsg(err.message || "Photo upload failed. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const createAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const { name, email, password } = Object.fromEntries(formData.entries());
    const photoInputUrl = formData.get("photoUrl")?.toString().trim();
    const finalPhotoUrl = photoInputUrl || photoUrl;

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: finalPhotoUrl || undefined,
        accountType: selectedRole,
        callbackURL: "/signin",
        rememberMe: true,
      });

      if (error) {
        setErrorMsg(error.message || "An error occurred during sign up.");
      } else {
        router.push("/signin");
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = async () => {
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
      });
      if (data) {
        router.push("/dashboard");
      }
      if (error) {
        setErrorMsg(error.message);
      }
    } catch (error) {
      setErrorMsg("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white border border-black/10 w-full max-w-115 p-8 md:p-12 shadow-sm">
        {/* Header Logo & Subtitle */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-[42px] font-black tracking-tighter uppercase text-black leading-none">
            SkillSwap
          </h1>
          <span className="text-[10px] font-bold tracking-[0.25em] text-black/50 uppercase block mt-2">
            Create Account
          </span>
        </div>

        {/* Tab Switching Layout */}
        <div className="flex border-b border-black/10 text-xs font-bold tracking-widest uppercase mb-8">
          <button
            onClick={() => router.push("/signin")}
            className="flex-1 text-center pb-3 text-black/40 hover:text-black transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="flex-1 text-center pb-3 border-b-2 border-black text-black cursor-pointer"
          >
            Sign Up
          </button>
        </div>

        {/* Error message logging context block */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium uppercase tracking-wider">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Account Generation Form */}
        <form onSubmit={createAccount} className="space-y-5">
          {/* Brutalist Account Role Selection Segment Toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black uppercase">
              I want to register as a
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setSelectedRole("client")}
                className={`py-3 text-center border transition-all cursor-pointer rounded-none ${
                  selectedRole === "client"
                    ? "bg-black text-white border-black"
                    : "bg-white text-black/50 border-black/20 hover:border-black/40"
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("freelancer")}
                className={`py-3 text-center border transition-all cursor-pointer rounded-none ${
                  selectedRole === "freelancer"
                    ? "bg-black text-white border-black"
                    : "bg-white text-black/50 border-black/20 hover:border-black/40"
                }`}
              >
                Freelancer
              </button>
            </div>
          </div>

          {/* Full Name Block */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black uppercase">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Alex Morgan"
              className="w-full border border-black/20 px-4 py-3 text-sm text-black placeholder-black/30 focus:outline-none focus:border-black transition-colors rounded-none"
              required
            />
          </div>

          {/* Email Address Block */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black uppercase">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="user@example.com"
              className="w-full border border-black/20 px-4 py-3 text-sm text-black placeholder-black/30 focus:outline-none focus:border-black transition-colors rounded-none"
              required
            />
          </div>

          {/* Profile Photo Block */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black uppercase">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full border border-black/20 px-4 py-3 text-sm text-black file:mr-4 file:py-2 file:px-3 file:border-0 file:bg-black file:text-white file:text-xs file:font-bold file:tracking-[0.2em] file:uppercase"
            />
            <input
              name="photoUrl"
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Or enter image URL"
              className="w-full border border-black/20 px-4 py-3 text-sm text-black placeholder-black/30 focus:outline-none focus:border-black transition-colors rounded-none"
            />
            {uploadingPhoto && (
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-black/50">
                Uploading photo...
              </p>
            )}
            {photoUrl && !uploadingPhoto && (
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-black/60">
                Photo ready to use
              </p>
            )}
          </div>

          {/* Choose Password Block */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black uppercase">
              Choose Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full border border-black/20 px-4 py-3 text-sm text-black placeholder-black/30 focus:outline-none focus:border-black transition-colors rounded-none"
              required
            />
          </div>

          {/* Primary Registration Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3.5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-black/90 transition-colors cursor-pointer mt-4 disabled:bg-black/40 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Divider text */}
        <div className="relative flex py-6 items-center">
          <div className="grow border-t border-black/10"></div>
          <span className="shrink mx-4 text-[9px] font-bold tracking-widest text-black/40 uppercase">
            OR
          </span>
          <div className="grow border-t border-black/10"></div>
        </div>

        {/* Federated Social Action */}
        <button
          onClick={() => googleAuth()}
          className="w-full border border-black text-black bg-white py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-black/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>➜</span> Continue with Google
        </button>
      </div>
    </div>
  );
}
