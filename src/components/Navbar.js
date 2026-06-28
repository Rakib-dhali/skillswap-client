"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // 1. Setup scroll tracking state
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  // 2. Event listener to check scroll direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // Hide if scrolling down and past a small threshold (e.g., 150px)
    if (latest > previous && latest > 150) {
      setHidden(true);
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
    // 3. Swap <header> for <motion.header> and apply variants
    <motion.header 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full bg-transparent backdrop-blur-md border-b border-black/10 select-none fixed top-0 left-0 z-50"
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 h-15 flex flex-row items-center justify-between">

        {/* Logo */}
        <div>
          <Link href="/">
            <h1 className="text-xl font-black tracking-tighter uppercase text-black">
              SkillSwap
            </h1>
          </Link>
        </div>

        {/* Links with conditional active underlines */}
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

        {/* Buttons */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-bold tracking-[0.15em] uppercase">
          {isPending ? (
            <div className="w-20 h-8 bg-black/10 animate-pulse" />
          ) : isLoggedIn ? (
            <>
              <Link href="/dashboard">
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
                className="bg-black text-white px-5 py-2.5 hover:bg-black/90 transition-colors duration-200 cursor-pointer tracking-wider"
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
                <button className="bg-black text-white px-5 py-2.5 hover:bg-black/90 transition-colors duration-200 cursor-pointer tracking-wider">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

      </nav>
    </motion.header>
  );
};

export default Navbar;