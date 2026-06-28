"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "motion/react"
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
      setIsOpen(false);
    } else {
      setHidden(false);
    }
  });

  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = session?.user;

  if (pathname && (pathname.startsWith("/dashboard") || pathname.startsWith("/signin") || pathname.startsWith("/signup") || pathname.startsWith("/payment") || pathname.startsWith("/success"))) {
    return null;
  }

  const signOut = async () => {
    const { data, error } = await authClient.signOut();
    if (error) {
      console.log(error);
    }
    if (data) {
      router.push("/signin");
    }
  };

  const getLinkClass = (path) => {
    const baseClass = "hover:text-black transition-colors duration-200 cursor-pointer pb-1 border-b-2";
    const isActive = pathname === path;
    return `${baseClass} ${isActive ? "text-black border-black" : "text-black/70 border-transparent"}`;
  };

  return (
    <>
      <motion.header 
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="w-full bg-white/80 backdrop-blur-md border-b border-black/10 select-none fixed top-0 left-0 z-50"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 h-16 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="block md:hidden text-black focus:outline-none p-1"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link href="/">
              <h1 className="text-xl font-black tracking-tighter uppercase text-black">
                SkillSwap
              </h1>
            </Link>
          </div>

          <div className="hidden md:block">
            <ul className="flex items-center gap-8 text-xs font-bold tracking-[0.15em] uppercase h-full pt-1">
              <li className={getLinkClass("/")}>
                <Link href="/">Home</Link>
              </li>
              <li className={getLinkClass("/tasks")}>
                <Link href="/tasks">Browse Tasks</Link>
              </li>
              <li className={getLinkClass("/freelancers")}>
                <Link href="/freelancers">Browse Freelancers</Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 text-xs font-bold tracking-[0.15em] uppercase">
            {isPending ? (
              <div className="w-20 h-8 bg-black/10 animate-pulse" />
            ) : isLoggedIn ? (
              <>
                <Link href="/dashboard" className="hidden sm:block">
                  <button className="text-black/70 hover:text-black transition-colors duration-200 cursor-pointer">
                    Dashboard
                  </button>
                </Link>
                {isLoggedIn.image ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-black/20 shrink-0">
                    <Image
                      src={isLoggedIn.image}
                      alt={isLoggedIn.name || "User avatar"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    title={isLoggedIn.name || isLoggedIn.email}
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold uppercase shrink-0 select-none"
                  >
                    {(isLoggedIn.name || isLoggedIn.email || "?").charAt(0)}
                  </div>
                )}
                <button
                  onClick={signOut}
                  className="bg-black text-white px-3 sm:px-5 py-2 sm:py-2.5 hover:bg-black/90 transition-colors duration-200 cursor-pointer tracking-wider text-[10px] sm:text-xs"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <button className="text-black/70 hover:text-black transition-colors duration-200 cursor-pointer">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-black text-white px-3 sm:px-5 py-2 sm:py-2.5 hover:bg-black/90 transition-colors duration-200 cursor-pointer tracking-wider text-[10px] sm:text-xs">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 w-full bg-white border-b border-black/10 z-40 md:hidden select-none"
          >
            <ul className="flex flex-col p-6 gap-4 text-xs font-bold tracking-[0.15em] uppercase border-t border-black/5">
              <li className="w-fit" onClick={() => setIsOpen(false)}>
                <Link href="/" className={getLinkClass("/")}>Home</Link>
              </li>
              <li className="w-fit" onClick={() => setIsOpen(false)}>
                <Link href="/tasks" className={getLinkClass("/tasks")}>Browse Tasks</Link>
              </li>
              <li className="w-fit" onClick={() => setIsOpen(false)}>
                <Link href="/freelancers" className={getLinkClass("/freelancers")}>Browse Freelancers</Link>
              </li>
              {isLoggedIn && (
                <li className="w-fit pt-2 sm:hidden" onClick={() => setIsOpen(false)}>
                  <Link href="/dashboard" className="text-black/70 hover:text-black">Dashboard</Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;