import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, limit, getDocs, where } from "firebase/firestore";
import type { Product } from "../types";

export const Home = () => {
  const [featuredWatches, setFeaturedWatches] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, "products"), 
          where("trending", "==", true),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (data.length < 3) {
          const fallbackQ = query(collection(db, "products"), limit(3));
          const fallbackSnapshot = await getDocs(fallbackQ);
          setFeaturedWatches(fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        } else {
          setFeaturedWatches(data);
        }
      } catch (error) {
        console.error("Error fetching featured watches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-white gap-4">
      <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
      <span className="tracking-[0.3em] uppercase text-xs">Loading Collections...</span>
    </div>
  );

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-dark-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.1)_0%,rgba(10,10,10,1)_100%)] opacity-80 mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10 text-center flex flex-col items-center px-6">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-[0.1em] md:tracking-[0.2em] uppercase mb-4"
          >
            Time
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-3xl md:text-7xl font-light text-gold-500 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-8"
          >
            Redefined
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <Link to="/shop">
              <Button size="lg" className="rounded-full text-base md:text-lg px-6 md:px-8 py-4 md:py-6 uppercase tracking-widest font-semibold">
                Explore Collection
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Watches in Background - Hidden or Adjusted for Mobile */}
        <motion.img 
          initial={{ opacity: 0, x: -100, y: 100 }}
          animate={{ 
            opacity: 0.4, 
            x: 0, 
            y: [-20, 20, -20],
            rotate: [5, -5, 5]
          }}
          transition={{ 
            opacity: { duration: 1.5, delay: 0.5 },
            y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 8, ease: "easeInOut" }
          }}
          src="/watch2.png" 
          alt="Floating Watch" 
          className="absolute -left-20 md:left-10 top-1/4 w-48 md:w-96 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-0 pointer-events-none blur-[2px] opacity-40 md:opacity-60"
        />

        <motion.img 
          initial={{ opacity: 0, x: 100, y: -100 }}
          animate={{ 
            opacity: 0.6, 
            x: 0, 
            y: [20, -20, 20],
            rotate: [-5, 5, -5]
          }}
          transition={{ 
            opacity: { duration: 1.5, delay: 0.7 },
            y: { repeat: Infinity, duration: 7, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 9, ease: "easeInOut" }
          }}
          src="/watch1.png" 
          alt="Floating Watch" 
          className="absolute -right-20 md:right-10 bottom-1/4 w-64 md:w-[28rem] drop-shadow-[0_20px_50px_rgba(255,215,0,0.15)] z-0 pointer-events-none opacity-50 md:opacity-80"
        />
      </section>

      {/* FEATURED / TRENDING SECTION */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <span className="text-gold-500 font-medium tracking-widest uppercase text-xs md:text-sm mb-2 block text-balance">Curated Selection</span>
            <h3 className="text-3xl md:text-5xl font-light tracking-wide">TRENDING <strong className="font-bold">NOW</strong></h3>
          </div>
          <Link to="/shop" className="flex items-center gap-2 text-white/60 hover:text-gold-500 transition-colors uppercase tracking-wider text-sm font-semibold group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {featuredWatches.map((watch, i) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              key={watch.id} 
              className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-gold-500/50 transition-colors duration-500 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]"
            >
              {watch.trending && <div className="absolute top-4 left-4 z-20 bg-gold-500 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Trending</div>}
              {watch.newArrival && <div className="absolute top-4 left-4 z-20 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">New Arrival</div>}
              {watch.discount && <div className="absolute top-4 right-4 z-20 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">-{watch.discount}%</div>}

              <Link to={`/product/${watch.id}`} className="block relative aspect-square overflow-hidden p-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60" />
                <motion.img 
                  src={watch.images[0]} 
                  alt={watch.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col transform translate-y-2 lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-lg md:text-xl font-medium text-white mb-1 group-hover:text-gold-400 transition-colors line-clamp-1">{watch.name}</h4>
                  <p className="text-white/70 font-light text-sm mix-blend-luminosity">₹{watch.price.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BRANDING PARALLAX */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden bg-dark-900 border-y border-white/10">
        <div className="absolute inset-0 opacity-20 bg-[url('/watch3.png')] bg-cover bg-center bg-fixed mix-blend-screen" />
        <div className="relative z-10 text-center max-w-3xl px-6">
          <Star className="w-8 h-8 md:w-12 md:h-12 text-gold-500 mx-auto mb-6 md:mb-8 opacity-80" />
          <p className="text-xl md:text-4xl font-light leading-relaxed text-white/90 italic">
            "Experience the pinnacle of horological craftsmanship. Arab Times brings the world's most desired luxury aesthetics within your reach."
          </p>
          <div className="mt-6 md:mt-8 text-gold-500 tracking-[0.2em] text-xs md:text-sm uppercase font-bold">Colachel, Tamil Nadu</div>
        </div>
      </section>
    </div>
  );
};

