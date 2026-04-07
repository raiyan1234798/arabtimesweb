import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Star, ShoppingBag, Check, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../store/useCartStore";
import { useSearchStore } from "../store/useSearchStore";
import { TiltCard } from "../components/ui/TiltCard";
import { db } from "../lib/firebase";
import { collection, onSnapshot, query as fsQuery, orderBy } from "firebase/firestore";
import toast from "react-hot-toast";
import type { Product } from "../types";

export const Shop = () => {
  const { query } = useSearchStore();
  const { addItem } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<string>("featured");

  useEffect(() => {
    const q = fsQuery(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data);
    });
    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (activeCategory !== "all") result = result.filter(p => p.category === activeCategory);
    if (query) {
      result = result.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }
    if (activeSort === "price-low") result.sort((a, b) => a.price - b.price);
    if (activeSort === "price-high") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, activeCategory, query, activeSort]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addItem({ ...product, quantity: 1 });
    toast.success(`${product.name} added to cart`);
  };

  const categories = ["all", "men", "women", "unisex", "accessories", "offers"];

  return (
    <div className="w-full min-h-screen bg-dark-950">
      {/* Category Strip */}
      <div className="border-b border-white/[0.06] py-4 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-6 flex gap-8 items-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[11px] uppercase font-medium tracking-[0.2em] transition-all relative pb-1 ${
                activeCategory === cat
                  ? "text-gold-500"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div layoutId="cat-underline" className="absolute bottom-0 left-0 right-0 h-px bg-gold-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10 flex gap-10">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-60 flex-shrink-0 space-y-8">
          <div className="glass rounded-2xl p-6 space-y-6 sticky top-28">
            <h3 className="font-display text-sm uppercase tracking-[0.15em] text-white/80 border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold-500" /> Filters
            </h3>

            <div>
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] mb-3">Categories</p>
              {["all", "men", "women", "unisex"].map(cat => (
                <label key={cat} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                    activeCategory === cat ? "border-gold-500 bg-gold-500" : "border-white/20 group-hover:border-white/40"
                  }`}>
                    {activeCategory === cat && <Check className="w-2.5 h-2.5 text-black" />}
                  </div>
                  <span className={`text-sm capitalize transition-colors ${
                    activeCategory === cat ? "text-gold-500" : "text-white/50 group-hover:text-white/70"
                  }`}>{cat}</span>
                </label>
              ))}
            </div>

            <div>
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] mb-3">Customer Ratings</p>
              {[4, 3, 2].map(star => (
                <label key={star} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 accent-gold-500 bg-dark-900 border-white/20 rounded" />
                  <span className="text-sm text-white/50 flex items-center gap-1.5 group-hover:text-white/70">
                    {star} <Star className="w-3 h-3 fill-gold-500 text-gold-500" /> & above
                  </span>
                </label>
              ))}
            </div>

            <div>
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] mb-3">Price Range</p>
              <input title="Price Filter" type="range" className="w-full accent-gold-500" />
              <div className="flex justify-between text-[10px] text-white/30 mt-1">
                <span>₹50K</span>
                <span>₹500K</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          {/* Top Bar */}
          <div className="glass rounded-xl p-4 mb-8 flex justify-between items-center">
            <p className="text-sm text-white/50">
              Showing <span className="text-white font-medium">{filteredProducts.length}</span> results
              {activeCategory !== "all" && (
                <> for <span className="text-gold-500 font-medium capitalize">"{activeCategory}"</span></>
              )}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/30 uppercase tracking-wider">Sort:</span>
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="text-xs font-medium bg-transparent text-white/70 border-none focus:ring-0 cursor-pointer uppercase tracking-wider"
              >
                <option value="featured" className="bg-dark-900">Featured</option>
                <option value="price-low" className="bg-dark-900">Price: Low to High</option>
                <option value="price-high" className="bg-dark-900">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredProducts.map((product, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                key={product.id}
              >
                <TiltCard className="group h-full">
                  <div className="glass rounded-2xl overflow-hidden hover-glow transition-all duration-500 hover:border-gold-500/20 flex flex-col h-full">
                    <Link to={`/product/${product.id}`} className="block relative aspect-square sm:aspect-[4/5] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent z-10" />
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 sm:p-6 group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.trending && (
                        <span className="absolute top-3 left-3 z-20 bg-gold-500/90 text-black text-[8px] sm:text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          Hot
                        </span>
                      )}
                      {product.discount && (
                        <span className="absolute top-3 right-3 z-20 bg-red-500/90 text-white text-[8px] sm:text-[9px] font-bold px-2 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      )}
                    </Link>

                    <div className="p-3 sm:p-5 flex flex-col flex-grow border-t border-white/[0.05]">
                      <Link to={`/product/${product.id}`} className="text-[11px] sm:text-sm font-medium text-white/80 hover:text-gold-400 mb-2 line-clamp-2 min-h-[32px] sm:min-h-[40px] transition-colors font-display">
                        {product.name}
                      </Link>

                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="bg-gold-500/20 text-gold-400 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          {product.rating || 4.5} <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-gold-500 text-gold-500" />
                        </span>
                        <span className="text-[9px] sm:text-xs text-white/30">({product.reviews || 0})</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 mb-3">
                        <span className="text-sm sm:text-xl font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.oldPrice && (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] sm:text-xs text-white/30 line-through">₹{product.oldPrice.toLocaleString('en-IN')}</span>
                            <span className="text-[9px] sm:text-[10px] font-bold text-green-400">
                              {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% off
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="hidden sm:block mb-4">
                        <p className="text-[10px] text-white/30 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-gold-500" /> Free Insured Delivery
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="mt-auto w-full bg-gold-500/10 hover:bg-gold-500 text-gold-500 hover:text-black py-2 sm:py-3 rounded-xl font-bold text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center gap-1.5 border border-gold-500/20 hover:border-gold-500"
                      >
                        <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" /> Add to Cart
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="glass rounded-2xl p-12 sm:p-20 text-center">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-white/10" />
              <h3 className="font-display text-lg sm:text-xl text-white/30 uppercase tracking-wider">No results found</h3>
              <p className="text-white/20 text-sm mt-2">Try adjusting your filters or search terms</p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter & Sort Bar */}
      <div className="lg:hidden fixed bottom-16 left-4 right-4 h-12 glass-strong rounded-2xl grid grid-cols-2 z-40 overflow-hidden">
        <button
          onClick={() => setActiveSort(activeSort === 'price-low' ? 'price-high' : 'price-low')}
          className="flex items-center justify-center gap-2 text-[10px] font-bold border-r border-white/[0.06] uppercase tracking-wider text-white/60"
        >
          Sort By
        </button>
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/60"
        >
          <SlidersHorizontal className="w-3 h-3" /> Filter
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-dark-900 z-[60] p-6 rounded-t-3xl border-t border-white/[0.08] lg:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-lg">Filters</h3>
                <button
                  title="Close Filters"
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 glass rounded-full"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pb-10">
                <div>
                  <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] mb-3">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {["all", "men", "women", "unisex"].map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setShowMobileFilters(false); }}
                        className={`px-4 py-2 rounded-full border text-sm capitalize transition-all ${
                          activeCategory === cat
                            ? "bg-gold-500 text-black border-gold-500 font-bold"
                            : "border-white/10 text-white/50 hover:border-white/30"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] mb-3">Sort Results</p>
                  {["featured", "price-low", "price-high"].map(sort => (
                    <button
                      key={sort}
                      onClick={() => { setActiveSort(sort); setShowMobileFilters(false); }}
                      className={`w-full text-left px-4 py-3 border-b border-white/[0.05] text-sm capitalize transition-colors ${
                        activeSort === sort ? "text-gold-500 font-bold" : "text-white/50"
                      }`}
                    >
                      {sort.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
