import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/[0.03]">
      {/* Main footer */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <img src="/logo.png" alt="Arab Times" className="w-8 h-8 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className="font-display text-lg tracking-[0.12em] font-light">
                <span className="text-gold-400/80">ARAB</span>
                <span className="text-white/50"> TIMES</span>
              </span>
            </Link>
            <p className="text-white/15 text-xs leading-[1.8] tracking-wide font-extralight max-w-[200px]">
              Luxury timepieces curated for the extraordinary. Colachel, Tamil Nadu.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-white/25 mb-6">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-white/15 hover:text-white/40 text-xs tracking-wider font-light transition-colors">All Timepieces</Link></li>
              <li><Link to="/shop?category=mens" className="text-white/15 hover:text-white/40 text-xs tracking-wider font-light transition-colors">Men's Collection</Link></li>
              <li><Link to="/shop?category=womens" className="text-white/15 hover:text-white/40 text-xs tracking-wider font-light transition-colors">Women's Collection</Link></li>
              <li><Link to="/shop?filter=trending" className="text-white/15 hover:text-white/40 text-xs tracking-wider font-light transition-colors">Trending</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-white/25 mb-6">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-white/15 hover:text-white/40 text-xs tracking-wider font-light transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-white/15 hover:text-white/40 text-xs tracking-wider font-light transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="text-white/15 hover:text-white/40 text-xs tracking-wider font-light transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/warranty" className="text-white/15 hover:text-white/40 text-xs tracking-wider font-light transition-colors">Warranty</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-white/25 mb-6">Newsletter</h4>
            <p className="text-white/15 text-xs tracking-wide font-extralight mb-5 leading-[1.8]">
              Receive exclusive access to new arrivals.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-transparent border border-white/[0.06] px-4 py-2.5 text-xs text-white tracking-wider focus:outline-none focus:border-white/15 placeholder:text-white/10 transition-colors"
              />
              <button type="button" className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] border-l-0 px-5 text-[9px] tracking-[0.3em] uppercase text-white/30 hover:text-white/60 transition-all">
                Join
              </button>
            </div>
            <div className="flex gap-8 mt-8">
              <a href="https://www.instagram.com/arab_times/" target="_blank" rel="noopener noreferrer" className="text-white/10 hover:text-white/30 text-[9px] tracking-[0.3em] uppercase transition-colors">Instagram</a>
              <a href="#" className="text-white/10 hover:text-white/30 text-[9px] tracking-[0.3em] uppercase transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.03]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-[9px] tracking-[0.2em] text-white/10">&copy; {new Date().getFullYear()} Arab Times. All rights reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <Link to="/privacy" className="text-[9px] tracking-[0.2em] text-white/10 hover:text-white/25 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-[9px] tracking-[0.2em] text-white/10 hover:text-white/25 transition-colors">Terms</Link>
            <Link to="/admin" className="text-[9px] tracking-[0.2em] text-white/0 hover:text-white/15 transition-all">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
