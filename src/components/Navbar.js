const Navbar = () => {
  return (
    <header className="w-full bg-white border-b border-black/10 select-none sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 h-20 flex flex-row items-center justify-between">
        
        {/* Logo */}
        <div>
          <h1 className="text-xl font-black tracking-tighter uppercase text-black">
            SkillSwap
          </h1>
        </div>

        {/* Links (Hidden on mobile, flex on desktop) */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-8 text-xs font-bold tracking-[0.15em] uppercase text-black/70">
            <li className="hover:text-black transition-colors duration-200 cursor-pointer">
              Home
            </li>
            <li className="hover:text-black transition-colors duration-200 cursor-pointer">
              Browse Tasks
            </li>
            <li className="hover:text-black transition-colors duration-200 cursor-pointer">
              Browse Freelancers
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-bold tracking-[0.15em] uppercase">
          <button className="text-black/70 hover:text-black transition-colors duration-200 cursor-pointer">
            Sign In
          </button>
          
          {/* Solid brutalist action button */}
          <button className="bg-black text-white px-5 py-2.5 hover:bg-black/90 transition-colors duration-200 cursor-pointer tracking-wider">
            Get Started
          </button>
        </div>

      </nav>
    </header>
  );
};

export default Navbar;