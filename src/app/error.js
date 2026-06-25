"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-6 text-black font-sans">
      <div className="max-w-lg w-full bg-white border border-black/10 shadow-sm p-10 text-center">
        <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-black/40 mb-4">
          Something went wrong
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
          Unexpected Error
        </h1>
        <p className="text-sm text-black/70 leading-relaxed mb-8">
          An unexpected error occurred while loading this page. Try refreshing or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-[0.25em] hover:bg-black/90 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-black text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-black/5 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
