"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const { email, password } = Object.fromEntries(formData.entries());

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
        rememberMe: true,
      });

      if (error) {
        setErrorMsg(error.message || "Invalid credentials. Please try again.");
      } else {
        router.push("/dashboard");
      }

      if (error) {
        setErrorMsg(error.message || "Invalid credentials. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
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
            Marketplace Access
          </span>
        </div>

        {/* Tab Switching Layout */}
        <div className="flex border-b border-black/10 text-xs font-bold tracking-widest uppercase mb-8">
          <button 
            onClick={() => router.push("/signin")} 
            className="flex-1 text-center pb-3 border-b-2 border-black text-black cursor-pointer"
          >
            Sign In
          </button>
          <button 
            onClick={() => router.push("/signup")} 
            className="flex-1 text-center pb-3 text-black/40 hover:text-black transition-colors cursor-pointer"
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

        {/* Credentials Form */}
        <form onSubmit={handleSignIn} className="space-y-6">
          {/* Email Input Block */}
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

          {/* Password Input Block */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-baseline">
              <label className="text-[10px] font-bold tracking-widest text-black uppercase">
                Password
              </label>
              <button type="button" className="text-[9px] font-bold tracking-wider text-black/50 uppercase hover:text-black cursor-pointer">
                Forgot?
              </button>
            </div>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              className="w-full border border-black/20 px-4 py-3 text-sm text-black placeholder-black/30 focus:outline-none focus:border-black transition-colors rounded-none"
              required
            />
          </div>

          {/* Primary Action Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-3.5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-black/90 transition-colors cursor-pointer mt-4 disabled:bg-black/40 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider text */}
        <div className="relative flex py-6 items-center">
          <div className="grow border-t border-black/10"></div>
          <span className="shrink mx-4 text-[9px] font-bold tracking-widest text-black/40 uppercase">OR</span>
          <div className="grow border-t border-black/10"></div>
        </div>

        {/* Federated Social Action */}
        <button className="w-full border border-black text-black bg-white py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-black/5 transition-all flex items-center justify-center gap-2 cursor-pointer">
          <span>➜</span> Continue with Google
        </button>

      </div>
    </div>
  );
}