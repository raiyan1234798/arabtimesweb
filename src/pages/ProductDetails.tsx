import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, ShieldCheck, ArrowLeft, Check, Loader2 } from "lucide-react";
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
      } catch (error) {
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
      <div className={`flex items-center gap-4 bg-[#1a1a1a] border border-gold-500/50 p-4 rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.15)] ${t.visible ? 'animate-fade-in' : 'animate-fade-out'}`}>
        <div className="bg-gold-500 text-black p-2 rounded-full"><Check className="w-4 h-4" /></div>
        <div>
          <h4 className="text-white font-bold">{product.name}</h4>
          <p className="text-white/60 text-sm">Added to your collection.</p>
        </div>
      </div>
    ));
  };

  if (loading) return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-white gap-4">
      <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
      <span className="tracking-[0.3em] uppercase text-xs">Accessing Vault...</span>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-white p-6 text-center">
      <h2 className="text-3xl font-light tracking-widest uppercase mb-4 text-gold-500">Observation Failed</h2>
      <p className="text-white/40 mb-8 max-w-md">The requested timepiece appears to be missing or delisted from our collection.</p>
      <Button onClick={() => navigate("/shop")} className="uppercase tracking-[0.2em] font-bold">Return to Collection</Button>
    </div>
  );


  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 lg:py-24">
      <button 
        onClick={() => navigate(-1)} 
        className="text-white/60 hover:text-gold-500 flex items-center gap-2 mb-6 md:mb-12 text-[10px] md:text-sm uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
        
        {/* IMAGE GALLERY */}
        <div className="flex flex-col gap-4 md:gap-6">
          <div 
            className="aspect-square bg-dark-900 rounded-2xl border border-white/5 overflow-hidden relative cursor-crosshair group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05)_0%,transparent_100%)] pointer-events-none" />
            
            <motion.img 
              key={activeImg}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: isHovering ? 1.2 : 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              src={product.images[activeImg]} 
              alt={product.name}
              className="w-full h-full object-contain p-4 md:p-8 transform-gpu"
            />
          </div>
          
          <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 no-scrollbar">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(idx)}
                className={`w-16 h-16 md:w-24 md:h-24 rounded-lg md:rounded-xl border-2 overflow-hidden transition-all duration-300 flex-shrink-0 ${
                  activeImg === idx ? "border-gold-500 shadow-[0_0_15px_rgba(255,215,0,0.2)]" : "border-white/10 opacity-50 hover:opacity-100 bg-dark-900"
                }`}
              >
                <img src={img} className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl font-light tracking-wide text-white mb-2">{product.name}</h1>
            <p className="text-2xl md:text-3xl font-semibold text-gold-500 tracking-wider mb-6 md:mb-8">₹{product.price.toLocaleString('en-IN')}</p>
            
            <div className="prose prose-invert border-t border-white/10 pt-6 md:pt-8 mb-6 md:mb-8">
              <p className="text-white/70 leading-relaxed font-light text-base md:text-lg">
                {product.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8">
              {product.tags.map(tag => (
                <span key={tag} className="text-[10px] text-white/40 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center border-b border-white/10 pb-8 mb-8 mt-8 md:mt-12">
              <Button size="lg" className="w-full sm:flex-1 py-6 text-base md:text-lg tracking-widest uppercase rounded-xl font-bold group" onClick={handleAddToCart}>
                <ShoppingBag className="w-5 h-5 group-hover:-translate-y-1 transition-transform" /> Add To Cart
              </Button>
              <button title="Added to Wishlist" className="w-full sm:w-auto p-4 rounded-xl border border-white/20 bg-white/5 hover:border-red-500 hover:text-red-500 transition-colors text-white/80 flex items-center justify-center gap-3 md:block">
                <Heart className="w-6 h-6 md:w-7 md:h-7" />
                <span className="sm:hidden uppercase tracking-widest text-xs font-bold">Wishlist</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 text-white/60">
                <ShieldCheck className="w-6 h-6 text-gold-500 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium uppercase tracking-wider text-sm">Authenticity Guaranteed</h4>
                  <p className="text-xs mt-1">Directly sourced from authorized luxury boutiques world-wide.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

