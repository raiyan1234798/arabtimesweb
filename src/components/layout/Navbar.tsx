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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { items } = useCartStore();
  const { query, setQuery } = useSearchStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out");
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: "Timepieces", path: "/shop" },
    { name: "Trending", path: "/shop?filter=trending" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-black/80 backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Left nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[11px] tracking-[0.3em] uppercase font-light transition-all duration-300 hover:opacity-100 ${
                    location.pathname === link.path ? "text-white opacity-100" : "text-white opacity-40"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Center logo */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 group"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <span className="font-display text-xl md:text-2xl tracking-[0.15em] font-light">
                <span className="text-gold-400">ARAB</span>
                <span className="text-white/90"> TIMES</span>
              </span>
            </Link>

            {/* Right icons */}
            <div className="flex items-center gap-6 md:gap-8">
              <button
                type="button"
                title="Search"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-white/40 hover:text-white transition-opacity hidden md:block"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              {user ? (
                <button
                  type="button"
                  title="Sign Out"
                  onClick={handleLogout}
                  className="text-white/40 hover:text-white transition-opacity hidden md:block"
                >
                  <UserIcon className="w-[18px] h-[18px]" />
                </button>
              ) : (
                <Link
                  to="/login"
                  title="Account"
                  className="text-white/40 hover:text-white transition-opacity hidden md:block"
                >
                  <UserIcon className="w-[18px] h-[18px]" />
                </Link>
              )}

              <Link to="/cart" title="Cart" className="relative text-white/40 hover:text-white transition-opacity">
                <ShoppingCart className="w-[18px] h-[18px]" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2.5 bg-gold-400 text-black text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>

              <button
                type="button"
                title="Menu"
                className="md:hidden text-white/40 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/[0.04] py-8"
            >
              <div className="max-w-2xl mx-auto px-6">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <Search className="w-5 h-5 text-white/20" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (location.pathname !== "/shop") navigate("/shop");
                    }}
                    placeholder="Search timepieces..."
                    autoFocus
                    className="flex-grow bg-transparent text-white text-lg font-light tracking-wider focus:outline-none placeholder:text-white/15"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-white/30 hover:text-white text-xs tracking-[0.2em] uppercase"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-8"
          >
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-display text-sm tracking-[0.4em] uppercase text-white/30 hover:text-white transition-colors">
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display text-sm tracking-[0.4em] uppercase text-white/30 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <div className="w-8 h-px bg-white/10 my-2" />

            <div className="relative w-64">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (location.pathname !== "/shop") navigate("/shop");
                  setIsMobileMenuOpen(false);
                }}
                placeholder="Search..."
                className="w-full bg-transparent border-b border-white/10 py-3 text-white text-center text-sm tracking-widest focus:outline-none focus:border-white/30 placeholder:text-white/15"
              />
            </div>

            {user ? (
              <button
                type="button"
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="font-display text-sm tracking-[0.4em] uppercase text-white/30 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="font-display text-sm tracking-[0.4em] uppercase text-white/30 hover:text-white transition-colors">
                Account
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
