import { Link } from "react-router-dom";
// import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-dark-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        <div className="space-y-4">
          <Link to="/" className="text-2xl font-bold tracking-widest text-white flex items-center gap-3">
            <img src="/logo.png" alt="Arab Times Logo" className="w-10 h-10 rounded-full border border-gold-500/30 object-cover shadow-[0_0_10px_rgba(255,215,0,0.2)]" />
            <span><span className="text-gold-500">ARAB</span> TIMES</span>
          </Link>
          <p className="text-white/60 text-sm leading-relaxed">
            Luxury Feel. Affordable Time. Discover our curated collection of premium timepieces in Colachel, Tamil Nadu.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold uppercase tracking-wider mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/shop" className="hover:text-gold-500 transition-colors">All Watches</Link></li>
            <li><Link to="/shop?category=mens" className="hover:text-gold-500 transition-colors">Men's Collection</Link></li>
            <li><Link to="/shop?category=womens" className="hover:text-gold-500 transition-colors">Women's Collection</Link></li>
            <li><Link to="/shop?filter=trending" className="hover:text-gold-500 transition-colors">Trending Now</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold uppercase tracking-wider mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/contact" className="hover:text-gold-500 transition-colors">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-gold-500 transition-colors">FAQs</Link></li>
            <li><Link to="/shipping" className="hover:text-gold-500 transition-colors">Shipping & Returns</Link></li>
            <li><Link to="/warranty" className="hover:text-gold-500 transition-colors">Warranty</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold uppercase tracking-wider mb-4">Newsletter</h4>
          <p className="text-white/60 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/5 border border-white/10 rounded-l-md px-4 py-2 w-full text-white text-sm focus:outline-none focus:border-gold-500 transition-colors"
            />
            <button className="bg-gold-500 text-black px-4 py-2 rounded-r-md text-sm font-semibold hover:bg-gold-400 transition-colors">
              JOIN
            </button>
          </div>
          <div className="flex gap-4 mt-6">
            <a href="#" className="text-white/60 hover:text-gold-500 transition-colors text-xs font-semibold tracking-widest uppercase">Instagram</a>
            <a href="#" className="text-white/60 hover:text-gold-500 transition-colors text-xs font-semibold tracking-widest uppercase">Facebook</a>
            <a href="#" className="text-white/60 hover:text-gold-500 transition-colors text-xs font-semibold tracking-widest uppercase">Twitter</a>
          </div>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/40">
        <p>© {new Date().getFullYear()} Arab Times. All rights reserved. Colachel, TN.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          <Link to="/admin" className="hover:text-white opacity-0 hover:opacity-100 transition-opacity duration-500">Admin</Link>
        </div>
      </div>
    </footer>
  );
};
