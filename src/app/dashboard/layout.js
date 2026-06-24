"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center text-xs font-bold tracking-widest text-black/40 uppercase">
        Initializing Secure Area...
      </div>
    );
  }

  if (!session?.user) {
    return null; // Will redirect in useEffect
  }

  const user = session.user;
  const role = user.role || "client";

  // Define navigation items dynamically based on the user's role
  const getNavLinks = () => {
    switch (role) {
      case "admin":
        return [
          { name: "Dashboard", href: "/dashboard/admin", icon: "📊" },
          { name: "Tasks", href: "/dashboard/admin/tasks", icon: "📋" },
          { name: "Users", href: "/dashboard/admin/users", icon: "👥" },
          { name: "Transactions", href: "/dashboard/admin/transactions", icon: "💳" },
          { name: "Platform Overview", href: "/dashboard/admin/overview", icon: "🌐" },
        ];
      case "freelancer":
        return [
          { name: "Dashboard", href: "/dashboard/freelancer", icon: "💼" },
          { name: "Browse Tasks", href: "/dashboard/freelancer/tasks", icon: "🔍" },
          { name: "My Proposals", href: "/dashboard/freelancer/proposals", icon: "📥" },
          { name: "My Earnings", href: "/dashboard/freelancer/earnings", icon: "💰" },
          { name: "Edit Profile", href: "/dashboard/freelancer/profile", icon: "👤" },
        ];
      case "client":
      default:
        return [
          { name: "Dashboard", href: "/dashboard/client", icon: "📈" },
          { name: "Tasks", href: "/dashboard/client/tasks", icon: "📝" },
          { name: "Proposals", href: "/dashboard/client/proposals", icon: "📩" },
          { name: "Financials", href: "/dashboard/client/financials", icon: "💵" },
          { name: "Platform Overview", href: "/dashboard/client/overview", icon: "🎯" },
        ];
    }
  };

  const navLinks = getNavLinks();

  const handleSignOut = async () => {
    const { data, error } = await authClient.signOut();
    if (error) {
      console.error(error);
    } else {
      router.push("/signin");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col md:flex-row font-sans text-black antialiased">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden w-full bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between z-40">
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black flex items-center justify-center text-white text-xs font-black tracking-tighter">S</div>
            <span className="font-black tracking-tighter text-sm uppercase">SkillSwap</span>
          </div>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-8 h-8 flex flex-col items-center justify-center gap-1 border border-black/10 bg-white active:bg-black/5"
        >
          <div className={`w-4 h-0.5 bg-black transition-all ${mobileMenuOpen ? "rotate-45 translate-y-1" : ""}`}></div>
          <div className={`w-4 h-0.5 bg-black transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}></div>
          <div className={`w-4 h-0.5 bg-black transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-1" : ""}`}></div>
        </button>
      </div>

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-black/10 flex flex-col justify-between z-30 transform transition-transform duration-300 md:translate-x-0 md:static md:h-screen shrink-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Logo / Title Block */}
          <div className="mb-10 hidden md:block">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-sm select-none tracking-tighter">S</div>
                <h1 className="text-lg font-black tracking-tighter uppercase text-black">
                  SkillSwap
                </h1>
              </div>
            </Link>
            <span className="text-[9px] font-bold tracking-[0.2em] text-black/40 uppercase block pl-11">
              {role} Dashboard
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                  <div 
                    className={`flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wider uppercase border transition-all duration-200 rounded-none cursor-pointer ${
                      isActive 
                        ? "bg-black text-white border-black" 
                        : "bg-transparent text-black/60 border-transparent hover:text-black hover:bg-black/5"
                    }`}
                  >
                    <span className="text-sm">{link.icon}</span>
                    <span>{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile details & signout */}
        <div className="p-6 border-t border-black/10 bg-white">
          <div className="flex items-center gap-3.5 mb-5">
            {user.image ? (
              <Image 
                src={user.image} 
                alt={user.name || "Avatar"} 
                width={36} 
                height={36} 
                className="w-9 h-9 rounded-none object-cover border border-black/10 grayscale animate-fade-in"
              />
            ) : (
              <div className="w-9 h-9 bg-black text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                {(user.name || user.email || "?").charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black tracking-tight text-black truncate uppercase">
                {user.name}
              </p>
              <p className="text-[9px] font-bold tracking-widest text-black/40 truncate uppercase mt-0.5">
                {role}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="w-full bg-white hover:bg-black/5 text-black border border-black px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 rounded-none cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 md:hidden transition-opacity"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto px-6 md:px-12 py-8 flex flex-col justify-between">
        <div className="w-full max-w-7xl mx-auto flex-1">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="w-full max-w-7xl mx-auto mt-12 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between text-[9px] font-bold tracking-widest text-black/30 uppercase gap-4">
          <span>© {new Date().getFullYear()} SkillSwap Network.</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-black">Home</Link>
            <Link href="/tasks" className="hover:text-black">Browse Tasks</Link>
            <Link href="/freelancers" className="hover:text-black">Browse Experts</Link>
          </div>
        </footer>
      </main>

    </div>
  );
}
