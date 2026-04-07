import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, ShieldCheck, ArrowLeft, Check, Loader2, Truck, Award } from "lucide-react";
import { Button } from "../components/ui/button";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import type { Product } from "../types";

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          toast.error("Timepiece not found in vault.");
        }
      } catch (_err) {
        toast.error("Failed to retrieve product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ ...product, quantity: 1 });
    toast.custom((t) => (
      <div className={`flex items-center gap-4 glass-strong p-4 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.1)] ${t.visible ? 'animate-fade-in' : 'animate-fade-out'}`}>
        <div className="bg-gold-500 text-black p-2 rounded-full"><Check className="w-4 h-4" /></div>
        <div>
          <h4 className="text-white font-bold text-sm">{product.name}</h4>
          <p className="text-white/50 text-xs">Added to your collection.</p>
        </div>
      </div>
    ));
  };

  if (loading) return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-white gap-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
        <div className="absolute inset-0 blur-xl bg-gold-500/20 rounded-full" />
      </div>
      <span className="tracking-[0.4em] uppercase text-[10px] text-white/30">Accessing Vault...</span>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-white p-6 text-center">
      <h2 className="font-display text-3xl font-light tracking-wider mb-4 text-gradient-gold">Not Found</h2>
      <p className="text-white/30 mb-8 max-w-md text-sm">The requested timepiece appears to be missing or delisted from our collection.</p>
      <Button onClick={() => navigate("/shop")} className="uppercase tracking-[0.2em] font-bold rounded-full px-8">Return to Collection</Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 lg:py-24">
      <button
        onClick={() => navigate(-1)}
        className="text-white/30 hover:text-gold-500 flex items-center gap-2 mb-8 md:mb-12 text-[10px] md:text-xs uppercase tracking-[0.2em] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">

        {/* IMAGE GALLERY */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-4 md:gap-6"
        >
          <div
            className="aspect-square glass rounded-3xl overflow-hidden relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,168,0,0.03)_0%,transparent_70%)] pointer-events-none z-10" />

            <motion.img
              key={activeImg}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: isHovering ? 1.15 : 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              src={product.images[activeImg]}
              alt={product.name}
              className="w-full h-full object-contain p-6 md:p-12 transform-gpu"
            />

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 z-20 glass-strong rounded-full px-3 py-1 text-[10px] text-white/40 tracking-wider">
              {activeImg + 1} / {product.images.length}
            </div>
          </div>

          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 no-scrollbar">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(idx)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 overflow-hidden transition-all duration-300 flex-shrink-0 ${
                  activeImg === idx
                    ? "border-gold-500 shadow-[0_0_15px_rgba(204,168,0,0.15)]"
                    : "border-white/[0.06] opacity-40 hover:opacity-80 bg-dark-900"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* DETAILS */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col justify-center"
        >
          {product.trending && (
            <span className="inline-flex items-center gap-1.5 text-gold-500 text-[10px] uppercase tracking-[0.2em] font-medium mb-4 w-fit">
              <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" /> Trending Now
            </span>
          )}

          <h1 className="font-display text-3xl md:text-5xl font-light tracking-wide text-white mb-3">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-6 md:mb-8">
            <p className="text-2xl md:text-3xl font-semibold text-gradient-gold tracking-wider">₹{product.price.toLocaleString('en-IN')}</p>
            {product.oldPrice && (
              <>
                <span className="text-base text-white/20 line-through">₹{product.oldPrice.toLocaleString('en-IN')}</span>
                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                  {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% off
                </span>
              </>
            )}
          </div>

          <div className="border-t border-white/[0.06] pt-6 md:pt-8 mb-6 md:mb-8">
            <p className="text-white/50 leading-relaxed font-light text-sm md:text-base">
              {product.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {product.tags.map(tag => (
              <span key={tag} className="text-[10px] text-white/30 uppercase tracking-[0.15em] border border-white/[0.06] px-3 py-1.5 rounded-full hover:border-gold-500/20 transition-colors">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center mb-8">
            <Button size="lg" className="w-full sm:flex-1 py-6 text-sm md:text-base tracking-[0.15em] uppercase rounded-2xl font-bold group" onClick={handleAddToCart}>
              <ShoppingBag className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" /> Add To Cart
            </Button>
            <button title="Add to Wishlist" className="w-full sm:w-auto p-4 rounded-2xl glass hover:border-red-500/50 hover:text-red-400 transition-all text-white/40 flex items-center justify-center gap-3">
              <Heart className="w-6 h-6" />
              <span className="sm:hidden uppercase tracking-[0.15em] text-xs font-bold">Wishlist</span>
            </button>
          </div>

          {/* Trust signals */}
          <div className="glass rounded-2xl p-5 space-y-4">
            {[
              { icon: ShieldCheck, title: "Authenticity Guaranteed", desc: "Sourced from authorized luxury boutiques" },
              { icon: Truck, title: "Free Insured Shipping", desc: "Premium delivery with full coverage" },
              { icon: Award, title: "Premium Quality", desc: "Every piece inspected by our experts" },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3">
                <item.icon className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white/80 text-sm font-medium">{item.title}</h4>
                  <p className="text-white/30 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
