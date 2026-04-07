import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, X, SlidersHorizontal, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../store/useCartStore";
import { useSearchStore } from "../store/useSearchStore";
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
    e.stopPropagation();
    addItem({ ...product, quantity: 1 });
    toast.success(`${product.name} added`);
  };

  const categories = ["all", "men", "women", "unisex"];

  return (
    <div className="w-full min-h-screen bg-black">

      {/* ─── Page Header ─── */}
      <div className="pt-32 md:pt-40 pb-12 md:pb-16 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-[10px] tracking-[0.5em] uppercase text-gold-400/50 mb-4"
        >
          Collection
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl font-light text-white/90 tracking-wide"
        >
          Timepieces
        </motion.h1>
      </div>

      {/* ─── Filter Bar ─── */}
      <div className="border-y border-white/[0.04] mb-12">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          {/* Categories - desktop */}
          <div className="hidden md:flex items-center gap-8">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] tracking-[0.3em] uppercase font-light transition-all duration-300 ${
                  activeCategory === cat ? "text-white" : "text-white/25 hover:text-white/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-[10px] tracking-[0.2em] text-white/20 uppercase md:hidden">
            {filteredProducts.length} pieces
          </p>

          {/* Sort + Count */}
          <div className="flex items-center gap-6">
            <span className="text-[10px] tracking-[0.15em] text-white/15 uppercase hidden md:block">
              {filteredProducts.length} pieces
            </span>
            <select
              title="Sort products"
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="text-[10px] tracking-[0.2em] uppercase bg-transparent text-white/40 border-none focus:ring-0 cursor-pointer font-light"
            >
              <option value="featured" className="bg-black">Featured</option>
              <option value="price-low" className="bg-black">Price: Low</option>
              <option value="price-high" className="bg-black">Price: High</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Product Grid ─── */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px md:gap-1">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: i * 0.04 }}
            >
              <Link
                to={`/product/${product.id}`}
                className="group relative block bg-[#060606] overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 md:p-10 transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

                  {/* Quick add - appears on hover */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-xl text-white text-[10px] tracking-[0.3em] uppercase py-3 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>

                  {/* Badges */}
                  {product.trending && (
                    <span className="absolute top-4 left-4 text-[8px] tracking-[0.25em] uppercase text-gold-400/70">
                      Trending
                    </span>
                  )}
                  {product.discount && (
                    <span className="absolute top-4 right-4 text-[8px] tracking-[0.2em] uppercase text-white/40">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 md:p-5">
                  <h3 className="font-display text-sm md:text-base text-white/70 font-light tracking-wide line-clamp-1 mb-1.5 group-hover:text-white/90 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs md:text-sm text-gold-400/60 tracking-wider font-light">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.oldPrice && (
                      <span className="text-[10px] text-white/15 line-through">
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-32 text-center">
            <Search className="w-10 h-10 mx-auto mb-6 text-white/[0.06]" />
            <h3 className="font-display text-xl text-white/20 tracking-wider">No timepieces found</h3>
            <p className="text-white/10 text-xs tracking-wider mt-2">Adjust your filters or search terms</p>
          </div>
        )}
      </div>

      {/* ─── Mobile bottom bar ─── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-black/90 backdrop-blur-xl border-t border-white/[0.04] grid grid-cols-2 z-40">
        <button
          type="button"
          onClick={() => setActiveSort(activeSort === "price-low" ? "price-high" : "price-low")}
          className="flex items-center justify-center gap-2 text-[10px] font-light border-r border-white/[0.04] uppercase tracking-[0.2em] text-white/30"
        >
          <ArrowRight className="w-3 h-3 rotate-90" /> Sort
        </button>
        <button
          type="button"
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center justify-center gap-2 text-[10px] font-light uppercase tracking-[0.2em] text-white/30"
        >
          <SlidersHorizontal className="w-3 h-3" /> Filter
        </button>
      </div>

      {/* ─── Mobile Filter Drawer ─── */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/80 z-50 md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] z-[60] p-8 rounded-t-2xl border-t border-white/[0.06] md:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-display text-lg font-light tracking-wider">Filter</h3>
                <button type="button" title="Close filters" onClick={() => setShowMobileFilters(false)} className="text-white/20 hover:text-white/50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-white/20 mb-4">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => { setActiveCategory(cat); setShowMobileFilters(false); }}
                        className={`px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all ${
                          activeCategory === cat
                            ? "bg-white text-black font-medium"
                            : "bg-white/[0.04] text-white/30"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-white/20 mb-4">Sort</p>
                  {["featured", "price-low", "price-high"].map(sort => (
                    <button
                      key={sort}
                      type="button"
                      onClick={() => { setActiveSort(sort); setShowMobileFilters(false); }}
                      className={`block w-full text-left py-3 border-b border-white/[0.03] text-xs tracking-[0.15em] capitalize transition-colors ${
                        activeSort === sort ? "text-white" : "text-white/20"
                      }`}
                    >
                      {sort.replace("-", ": ")}
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
