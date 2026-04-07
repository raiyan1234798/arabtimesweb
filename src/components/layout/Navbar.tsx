import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, User as UserIcon } from "lucide-react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useState, useEffect } from "react";
import { useCartStore } from "../../store/useCartStore";
import { useSearchStore } from "../../store/useSearchStore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCartStore();
  const { query, setQuery } = useSearchStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Successfully signed out");
    } catch (_err) {
      toast.error("Failed to sign out");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Trending", path: "/shop?filter=trending" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-dark-950/60 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center gap-10">
        <Link to="/" className="text-2xl font-bold tracking-widest text-white flex-shrink-0 flex items-center gap-3 group">
          <div className="relative">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full border border-gold-500/30 group-hover:border-gold-500/60 transition-colors" />
            <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="hidden lg:inline-block uppercase tracking-[0.08em] font-display text-xl">
            <span className="text-gradient-gold font-semibold">Arab</span>
            <span className="text-white/80 font-light">Times</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-grow max-w-xl relative">
          <div className="flex w-full glass rounded-2xl overflow-hidden focus-within:border-gold-500/30 transition-all">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (location.pathname !== "/shop") navigate("/shop");
              }}
              placeholder="Search luxury timepieces..."
              className="flex-grow bg-transparent px-5 py-2.5 text-sm text-white focus:outline-none placeholder:text-white/20"
            />
            <button type="button" title="Search" className="px-5 flex items-center justify-center text-white/30 hover:text-gold-500 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nav & Icons */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <nav className="hidden xl:flex gap-6 items-center mr-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] tracking-[0.2em] uppercase font-medium transition-all relative py-1 ${
                  location.pathname === link.path ? "text-gold-500" : "text-white/40 hover:text-white/70"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-px bg-gold-500" />
                )}
              </Link>
            ))}
          </nav>

          {user ? (
            <button type="button" title="Sign Out" onClick={handleLogout} className="text-white/40 hover:text-gold-500 transition-colors flex items-center gap-2 group">
              <UserIcon className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline text-[9px] uppercase tracking-[0.15em] font-medium text-white/30">Out</span>
            </button>
          ) : (
            <Link title="User Account" to="/login" className="text-white/40 hover:text-gold-500 transition-colors group">
              <UserIcon className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
            </Link>
          )}

          <Link title="Cart" to="/cart" className="relative text-white/40 hover:text-gold-500 transition-colors group">
            <ShoppingCart className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2.5 bg-gold-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(204,168,0,0.4)]"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>

          <button
            type="button"
            title="Toggle Menu"
            className="md:hidden text-white/40 hover:text-gold-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 right-0 bg-dark-950/95 backdrop-blur-2xl border-b border-white/[0.06] p-6 md:hidden flex flex-col gap-5"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base tracking-[0.1em] uppercase text-white/60 hover:text-gold-500 transition-colors font-light"
              >
                {link.name}
              </Link>
            ))}
            <div className="relative mt-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full glass rounded-xl py-2.5 px-4 pl-10 text-white text-sm focus:outline-none focus:border-gold-500/30 placeholder:text-white/20"
              />
              <Search className="w-4 h-4 text-white/30 absolute left-3 top-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
