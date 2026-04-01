import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, User as UserIcon } from "lucide-react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
  const [user, setUser] = useState<any>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Successfully signed out");
    } catch (error) {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-dark-950/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center gap-10">
          <Link to="/" className="text-2xl font-bold tracking-widest text-white flex-shrink-0 flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full border border-gold-500/30" />
            <span className="hidden lg:inline-block uppercase tracking-tighter"><span className="text-gold-500">Arab</span>Times</span>
          </Link>

          {/* Amazon-style Search Bar */}
          <div className="hidden md:flex flex-grow max-w-2xl relative group">
            <div className="flex w-full bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden focus-within:border-gold-500 transition-all shadow-lg">
               <button className="px-4 bg-[#222] border-r border-white/5 text-xs text-white/50 hover:text-gold-500 transition-colors uppercase tracking-widest font-bold">
                 All
               </button>
               <input 
                 type="text" 
                 value={query}
                 onChange={(e) => {
                   setQuery(e.target.value);
                   if (location.pathname !== "/shop") navigate("/shop");
                 }}
                 placeholder="Search for luxury timepieces, brands..." 
                 className="flex-grow bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
               />
               <button title="Search" className="bg-gold-500 px-6 flex items-center justify-center hover:bg-gold-400 text-black transition-colors">
                 <Search className="w-5 h-5" />
               </button>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-8 flex-shrink-0">
            <nav className="hidden xl:flex gap-8 items-center mr-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs tracking-[0.2em] uppercase font-bold transition-all hover:text-gold-500 relative ${
                    location.pathname === link.path ? "text-gold-500" : "text-white/60"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {user ? (
              <button title="Sign Out" onClick={handleLogout} className="text-white hover:text-gold-500 transition-colors flex items-center gap-2 group">
                 <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                 <span className="hidden lg:inline text-[10px] uppercase tracking-widest font-bold text-white/40">Out</span>
              </button>
            ) : (
              <Link title="User Account" to="/login" className="text-white hover:text-gold-500 transition-colors flex items-center gap-2 group">
                 <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            )}

            <Link title="Cart" to="/cart" className="relative text-white hover:text-gold-500 transition-colors group">
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-gold-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
            
            <button 
              title="Toggle Menu"
              className="md:hidden text-white hover:text-gold-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-dark-900 border-b border-white/10 p-6 md:hidden flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg tracking-wide uppercase hover:text-gold-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="relative mt-2">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-white/5 border border-white/10 rounded-md py-2 px-4 pl-10 text-white focus:outline-none focus:border-gold-500"
              />
              <Search className="w-4 h-4 text-white/50 absolute left-3 top-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
