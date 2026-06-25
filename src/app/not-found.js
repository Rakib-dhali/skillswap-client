import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-6 text-black font-sans">
      <div className="max-w-lg w-full bg-white border border-black/10 shadow-sm p-10 text-center">
        <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-black/40 mb-4">
          404 NOT FOUND
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
          Page Not Found
        </h1>
        <p className="text-sm text-black/70 leading-relaxed mb-8">
          The page you are looking for does not exist or has been moved. Check the URL or return to the homepage.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-[0.25em] hover:bg-black/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
