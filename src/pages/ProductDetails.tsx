import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, ArrowLeft, Check, Loader2, Shield, Truck } from "lucide-react";
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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          toast.error("Timepiece not found.");
        }
      } catch (_err) {
        toast.error("Failed to load product.");
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
      <div className={`flex items-center gap-4 bg-[#111] border border-white/[0.06] p-4 rounded-none ${t.visible ? 'animate-fade-in' : ''}`}>
        <div className="bg-gold-400 text-black p-1.5 rounded-full"><Check className="w-3 h-3" /></div>
        <div>
          <p className="text-white text-sm font-light tracking-wide">{product.name}</p>
          <p className="text-white/30 text-[10px] tracking-wider uppercase">Added to cart</p>
        </div>
      </div>
    ));
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <Loader2 className="w-8 h-8 text-gold-400/40 animate-spin" />
      <span className="tracking-[0.5em] uppercase text-[10px] text-white/15">Loading</span>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <h2 className="font-display text-3xl font-light text-white/60 mb-4">Not Found</h2>
      <p className="text-white/20 text-sm mb-8">This timepiece is no longer available.</p>
      <Button onClick={() => navigate("/shop")} className="uppercase tracking-[0.2em] text-xs">
        Return to Collection
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-28 md:pt-36 pb-24">

        {/* Back link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate(-1)}
          className="text-white/20 hover:text-white/50 flex items-center gap-2 mb-12 md:mb-16 text-[10px] tracking-[0.3em] uppercase transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">

          {/* ─── Image Gallery ─── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Main image */}
            <div className="relative aspect-square bg-[#060606] overflow-hidden mb-3 group">
              <motion.img
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-contain p-8 md:p-16 group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              />

              {/* Image counter */}
              <span className="absolute bottom-4 right-4 text-[9px] tracking-[0.2em] text-white/15">
                {activeImg + 1} / {product.images.length}
              </span>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImg(idx)}
                    className={`w-20 h-20 flex-shrink-0 bg-[#060606] transition-all duration-300 ${
                      activeImg === idx
                        ? "opacity-100 ring-1 ring-white/20"
                        : "opacity-30 hover:opacity-60"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ─── Product Info ─── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            {/* Breadcrumb */}
            {product.category && (
              <p className="text-[9px] tracking-[0.4em] uppercase text-gold-400/40 mb-6">
                {product.category}
              </p>
            )}

            <h1 className="font-display text-3xl md:text-5xl font-light tracking-wide text-white/90 leading-tight mb-6">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-white/[0.04]">
              <span className="font-display text-2xl md:text-3xl text-gold-400/80 font-light tracking-wider">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-sm text-white/15 line-through">
                    ₹{product.oldPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-green-500/60">
                    {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-white/30 text-sm md:text-base font-extralight leading-[1.8] tracking-wide mb-8">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {product.tags.map(tag => (
                  <span key={tag} className="text-[9px] tracking-[0.25em] uppercase text-white/15 border border-white/[0.04] px-3 py-1.5">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mb-10">
              <Button
                size="lg"
                className="flex-1 py-6 text-[11px] tracking-[0.3em] uppercase rounded-none font-medium"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </Button>
              <button
                type="button"
                title="Add to Wishlist"
                className="w-14 flex items-center justify-center border border-white/[0.06] text-white/20 hover:text-red-400 hover:border-red-400/20 transition-all"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Trust signals */}
            <div className="space-y-4 pt-8 border-t border-white/[0.04]">
              {[
                { icon: Shield, text: "Authenticity guaranteed on every piece" },
                { icon: Truck, text: "Free insured shipping" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-gold-400/40 flex-shrink-0" />
                  <span className="text-white/20 text-xs tracking-[0.1em] font-light">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
