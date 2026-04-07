import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="relative bg-dark-950 border-t border-white/[0.05] pt-20 pb-8 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(204,168,0,0.03)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Top section with logo and tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
            <img src="/logo.png" alt="Arab Times Logo" className="w-12 h-12 rounded-full border border-gold-500/30 group-hover:border-gold-500/60 transition-colors" />
            <span className="font-display text-2xl tracking-wide">
              <span className="text-gradient-gold font-semibold">Arab</span>
              <span className="text-white/80 font-light"> Times</span>
            </span>
          </Link>
          <p className="text-white/30 text-sm font-light max-w-md mx-auto leading-relaxed">
            Luxury Feel. Affordable Time. Premium timepieces curated for the extraordinary.
          </p>
        </motion.div>

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-white/60 mb-5">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop" className="text-white/30 hover:text-gold-500 transition-colors">All Watches</Link></li>
              <li><Link to="/shop?category=mens" className="text-white/30 hover:text-gold-500 transition-colors">Men's Collection</Link></li>
              <li><Link to="/shop?category=womens" className="text-white/30 hover:text-gold-500 transition-colors">Women's Collection</Link></li>
              <li><Link to="/shop?filter=trending" className="text-white/30 hover:text-gold-500 transition-colors">Trending Now</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-white/60 mb-5">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/contact" className="text-white/30 hover:text-gold-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-white/30 hover:text-gold-500 transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="text-white/30 hover:text-gold-500 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/warranty" className="text-white/30 hover:text-gold-500 transition-colors">Warranty</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-white/60 mb-5">Newsletter</h4>
            <p className="text-white/30 text-sm mb-4 leading-relaxed">Subscribe for exclusive access to new arrivals and private offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="glass rounded-l-xl px-4 py-2.5 w-full text-white text-sm focus:outline-none focus:border-gold-500/30 transition-colors placeholder:text-white/15"
              />
              <button type="button" className="bg-gold-500 text-black px-5 py-2.5 rounded-r-xl text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition-colors">
                Join
              </button>
            </div>
            <div className="flex gap-6 mt-6">
              <a href="https://www.instagram.com/arab_times/" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-gold-500 transition-colors text-[10px] font-medium tracking-[0.2em] uppercase">Instagram</a>
              <a href="#" className="text-white/20 hover:text-gold-500 transition-colors text-[10px] font-medium tracking-[0.2em] uppercase">Facebook</a>
              <a href="#" className="text-white/20 hover:text-gold-500 transition-colors text-[10px] font-medium tracking-[0.2em] uppercase">Twitter</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between text-[10px] text-white/20 tracking-wider">
          <p>&copy; {new Date().getFullYear()} Arab Times. All rights reserved. Colachel, TN.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white/40 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/40 transition-colors">Terms of Service</Link>
            <Link to="/admin" className="opacity-0 hover:opacity-100 transition-opacity duration-500 hover:text-white/40">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
