import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-white flex items-center px-6 py-12 md:px-16 lg:px-24 select-none">
      <div className="max-w-7xl w-full flex flex-col justify-center">
        
        {/* Main Bold Headline */}
        <h1 className="text-[40px] leading-[1.1] sm:text-[56px] md:text-[68px] lg:text-[76px] font-black tracking-tight text-black text-left uppercase font-sans">
          Get your tasks <br />
          done by skilled <br />
          freelancers
        </h1>

        {/* Subtext Description Block */}
        <div className="mt-8 md:mt-10 pl-4 border-l-[3px] border-black max-w-[540px]">
          <p className="text-sm sm:text-base text-black/80 font-normal leading-relaxed text-left">
            The fastest, most brutally efficient marketplace for digital micro-tasks. No 
            fluff, just work exchanged for capital. Connect, execute, and scale your 
            operations today.
          </p>
        </div>

        {/* Action Buttons / Navigation Links */}
        <div className="mt-12 md:mt-16 flex flex-row items-center gap-8 sm:gap-12 text-xs sm:text-sm font-bold tracking-[0.15em] text-black/70 uppercase">
        <Link href="/dashboard/client/tasks/post">
          <button className="hover:text-black bg-gray-100 hover:bg-gray-200 p-2 rounded transition-colors duration-200 cursor-pointer">
            Post a task
          </button>
        </Link>
        <Link href="/tasks">
          <button className="hover:text-black bg-gray-100 hover:bg-gray-200 p-2 rounded transition-colors duration-200 cursor-pointer">
            Browse tasks
          </button></Link>
        </div>

      </div>
    </section>
  );
}