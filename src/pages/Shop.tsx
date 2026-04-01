import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Star, ShoppingBag, Check, X } from "lucide-react";
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
    if (activeSort === "price-low") result.sort((a,b) => a.price - b.price);
    if (activeSort === "price-high") result.sort((a,b) => b.price - a.price);
    return result;
  }, [products, activeCategory, query, activeSort]);


  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addItem({ ...product, quantity: 1 });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="w-full min-h-screen bg-[#f1f2f4] text-black">
      {/* Category Strip */}
      <div className="bg-white border-b border-gray-200 py-3 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-6 flex gap-8">
            {["all", "men", "women", "unisex", "accessories", "offers"].map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase font-bold tracking-widest hover:text-blue-600 transition-colors ${activeCategory === cat ? 'text-blue-600' : 'text-gray-500'}`}
              >
                {cat}
              </button>
            ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 bg-white p-6 rounded-sm shadow-sm border border-gray-200 h-fit">
          <div>
            <h3 className="font-bold text-sm uppercase mb-4 border-b pb-2">Filters</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Categories</p>
                {["all", "men", "women", "unisex"].map(cat => (
                  <label key={cat} className="flex items-center gap-3 py-1 cursor-pointer group">
                    <input type="radio" name="cat" checked={activeCategory === cat} onChange={() => setActiveCategory(cat)} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm capitalize group-hover:text-blue-600 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
              
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Customer Ratings</p>
                {[4, 3, 2].map(star => (
                   <label key={star} className="flex items-center gap-3 py-1 cursor-pointer group">
                     <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                     <span className="text-sm flex items-center gap-1">{star} <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> & above</span>
                   </label>
                ))}
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Price Range</p>
                <input title="Price Filter" type="range" className="w-full accent-blue-600" />
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-1">
                   <span>₹50K</span>
                   <span>₹500K</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          {/* Top Bar */}
          <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200 mb-6 flex justify-between items-center">
            <p className="text-sm">Showing <span className="font-bold">{filteredProducts.length}</span> results for <span className="text-blue-600 font-bold capitalize">"{activeCategory}"</span></p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Sort By:</span>
              <select 
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="text-sm font-bold border-none bg-transparent focus:ring-0 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={product.id}
                className="bg-white border border-gray-200 rounded-sm hover:shadow-xl transition-shadow group flex flex-col h-full overflow-hidden"
              >
                <Link to={`/product/${product.id}`} className="block relative aspect-square sm:aspect-[4/5] overflow-hidden p-2 sm:p-4">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  {product.trending && <span className="absolute top-2 left-2 bg-red-600 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-sm">Hot</span>}
                </Link>

                <div className="p-3 sm:p-5 flex flex-col flex-grow border-t border-gray-50">
                  <Link to={`/product/${product.id}`} className="text-[12px] sm:text-sm font-medium text-gray-900 hover:text-blue-600 mb-1 line-clamp-2 min-h-[32px] sm:min-h-[40px]">
                    {product.name}
                  </Link>

                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className="bg-green-700 text-white text-[8px] sm:text-[10px] font-bold px-1 py-0.5 rounded-sm flex items-center gap-0.5">
                      {product.rating || 4.5} <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-white" />
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium whitespace-nowrap">({product.reviews || 0})</span>
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="h-2.5 sm:h-4 ml-auto" />
                  </div>


                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 mb-2">
                    <span className="text-sm sm:text-xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.oldPrice && (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] sm:text-sm text-gray-400 line-through">₹{product.oldPrice.toLocaleString('en-IN')}</span>
                        <span className="text-[9px] sm:text-xs font-bold text-green-600">
                          {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% off
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="hidden sm:block space-y-1.5 mb-4">
                    <p className="text-[10px] text-gray-600 flex items-center gap-1.5">
                       <Check className="w-3 h-3 text-green-600" /> Free Delivery
                    </p>
                  </div>

                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="mt-auto w-full bg-[#fb641b] hover:bg-[#f85606] text-white py-2 sm:py-3 rounded-sm font-bold text-[10px] sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" /> ADD
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="bg-white border border-gray-200 p-10 sm:p-20 text-center rounded-sm">
               <Search className="w-12 h-12 sm:w-16 h-16 mx-auto mb-4 text-gray-200" />
               <h3 className="text-lg sm:text-xl font-bold text-gray-400 uppercase">Sorry, no results found!</h3>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter & Sort Bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 h-12 bg-white border-t border-gray-200 grid grid-cols-2 z-40">
         <button 
           onClick={() => setActiveSort(activeSort === 'price-low' ? 'price-high' : 'price-low')}
           className="flex items-center justify-center gap-2 text-xs font-bold border-r border-gray-200 uppercase"
         >
           Sort By
         </button>
         <button 
           onClick={() => setShowMobileFilters(true)}
           className="flex items-center justify-center gap-2 text-xs font-bold uppercase"
         >
           Filter
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
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[60] p-6 rounded-t-3xl border-t border-gray-200 lg:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                <button 
                  title="Close Filters"
                  onClick={() => setShowMobileFilters(false)} 
                  className="p-2 border border-black/10 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pb-10">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-3">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {["all", "men", "women", "unisex"].map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => { setActiveCategory(cat); setShowMobileFilters(false); }}
                        className={`px-4 py-2 rounded-full border text-sm capitalize ${activeCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                   <p className="text-xs font-bold text-gray-400 uppercase mb-3">Sort Results</p>
                   {["featured", "price-low", "price-high"].map(sort => (
                      <button 
                        key={sort}
                        onClick={() => { setActiveSort(sort); setShowMobileFilters(false); }}
                        className={`w-full text-left px-4 py-3 border-b text-sm capitalize ${activeSort === sort ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
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
