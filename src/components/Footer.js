import { FaXTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-black/10 py-16 px-6 md:px-16 lg:px-24 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 items-start">
        
        {/* Column 1: Brand & Contact Info */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-black tracking-tighter uppercase text-black">
            SkillSwap
          </h2>
          <div className="text-xs tracking-wider text-black/60 font-medium">
            <span className="block mb-1 font-black text-[10px] text-black/40">SUPPORT & OPERATIONS</span>
            <a href="mailto:ops@skillswap.com" className="text-black hover:underline transition-all block">
              ops@skillswap.com
            </a>
          </div>
        </div>

        {/* Column 2: Physical HQ Address */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-black tracking-[0.2em] text-black/40 uppercase">
            Headquarters
          </span>
          <address className="text-xs font-medium tracking-wider text-black/70 not-italic leading-relaxed">
            100 Brutalist Blvd, Suite 404<br />
            New York, NY 10013<br />
            United States
          </address>
        </div>

        {/* Column 3: Navigation Links */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-black tracking-[0.2em] text-black/40 uppercase">
            Navigation
          </span>
          <ul className="flex flex-col gap-2 text-xs font-bold tracking-[0.15em] uppercase text-black/70">
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

        {/* Column 4: Social Channels & Legal Copyright */}
        <div className="flex flex-col lg:items-end gap-6 self-stretch justify-between">
          <div className="flex flex-col lg:items-end gap-3">
            <span className="text-[10px] font-black tracking-[0.2em] text-black/40 uppercase">
              Connect
            </span>
            <div className="flex items-center gap-5 text-lg text-black/70">
              {/* X (Formerly Twitter) */}
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-black transition-colors duration-200"
                aria-label="X"
              >
                <FaXTwitter />
              </a>
              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-black transition-colors duration-200"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-[16px]" />
              </a>
              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-black transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Dynamic Copyright Year */}
          <span className="text-[10px] font-bold tracking-widest text-black/40 uppercase whitespace-nowrap lg:text-right mt-4 lg:mt-0">
            © {currentYear} SKILLSWAP INC.
          </span>
        </div>

      </div>
    </footer>
  );
}