"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/icon.png"

// Import required React Icons
import { 
  LuLayoutDashboard, 
  LuClipboardList, 
  LuUsers, 
  LuCreditCard, 
  LuBriefcase, 
  LuSearch, 
  LuInbox, 
  LuRocket, 
  LuDollarSign, 
  LuUser,
  LuFileText,
  LuMenu,  // Added for Hamburger Menu
  LuX      // Added for Close Icon
} from "react-icons/lu";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push("/signin");
      } else {
        if (session.user.banned) {
          const signOutUser = async () => {
            await authClient.signOut();
            router.push("/signin");
          };
          signOutUser();
          return;
        }

        const userRole = session.user.role || "client";

        // Guard admin routes
        if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
          router.push(`/dashboard/${userRole}`);
        }

        // Guard client routes
        if (pathname.startsWith("/dashboard/client") && userRole !== "client" && userRole !== "admin") {
          router.push(`/dashboard/${userRole}`);
        }
        
        // Guard freelancer routes
        if (pathname.startsWith("/dashboard/freelancer") && userRole !== "freelancer" && userRole !== "admin") {
          router.push(`/dashboard/${userRole}`);
        }
      }
    }
  }, [session, isPending, router, pathname]);

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

  // Define navigation items dynamically with functional React Icons components
  const getNavLinks = () => {
    switch (role) {
      case "admin":
        return [
          { name: "Dashboard", href: "/dashboard/admin", icon: <LuLayoutDashboard className="w-4 h-4" /> },
          { name: "Tasks", href: "/dashboard/admin/tasks", icon: <LuClipboardList className="w-4 h-4" /> },
          { name: "Users", href: "/dashboard/admin/users", icon: <LuUsers className="w-4 h-4" /> },
          { name: "Transactions", href: "/dashboard/admin/transactions", icon: <LuCreditCard className="w-4 h-4" /> },
        ];
      case "freelancer":
        return [
          { name: "Dashboard", href: "/dashboard/freelancer", icon: <LuBriefcase className="w-4 h-4" /> },
          { name: "Browse Tasks", href: "/dashboard/freelancer/tasks", icon: <LuSearch className="w-4 h-4" /> },
          { name: "My Proposals", href: "/dashboard/freelancer/proposals", icon: <LuInbox className="w-4 h-4" /> },
          { name: "Active Projects", href: "/dashboard/freelancer/active-projects", icon: <LuRocket className="w-4 h-4" /> },
          { name: "My Earnings", href: "/dashboard/freelancer/earnings", icon: <LuDollarSign className="w-4 h-4" /> },
          { name: "Edit Profile", href: "/dashboard/freelancer/profile", icon: <LuUser className="w-4 h-4" /> },
        ];
      case "client":
      default:
        return [
          { name: "Dashboard", href: "/dashboard/client", icon: <LuLayoutDashboard className="w-4 h-4" /> },
          { name: "Tasks", href: "/dashboard/client/tasks", icon: <LuFileText className="w-4 h-4" /> },
          { name: "Proposals", href: "/dashboard/client/proposals", icon: <LuInbox className="w-4 h-4" /> },
          { name: "Edit Profile", href: "/dashboard/client/profile", icon: <LuUser className="w-4 h-4" /> },
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
      <div className="md:hidden fixed w-full bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between z-40">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src={logo} width={30} height={30} alt="logo" className="invert" />
            <span className="font-black  tracking-tighter text-sm uppercase">SkillSwap</span>
          </div>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-8 h-8 flex items-center justify-center border border-black/10 bg-white active:bg-black/5 cursor-pointer text-black overflow-hidden"
          aria-label="Toggle Menu"
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            <LuX className={`w-5 h-5 absolute transition-all duration-300 ${mobileMenuOpen ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"}`} />
            <LuMenu className={`w-5 h-5 absolute transition-all duration-300 ${mobileMenuOpen ? "-rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
          </div>
        </button>
      </div>

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r mt-15 md:mt-0 border-black/10 flex flex-col justify-between z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen shrink-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Logo / Title Block */}
          <div className="mb-10 hidden md:block">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-3 mb-1">
                <Image src={logo} width={40} height={40} alt="logo" className="invert" />
                <div className="flex-col">
                  <h1 className="text-lg font-black tracking-tighter uppercase text-black">
                    SkillSwap
                  </h1>
                  <p className="text-[9px] font-bold tracking-[0.2em] text-black/40 uppercase block ">
                    {role} Dashboard
                  </p>
                </div>
              </div>
            </Link>
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
                    <span className="flex items-center justify-center shrink-0">{link.icon}</span>
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
      <div 
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 z-20 md:hidden transition-opacity duration-300 ease-in-out ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

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