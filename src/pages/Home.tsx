import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, limit, getDocs, where } from "firebase/firestore";
import { ScrollFrames } from "../components/ui/ScrollFrames";
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
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

        if (data.length < 3) {
          const fallbackQ = query(collection(db, "products"), limit(4));
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <Loader2 className="w-8 h-8 text-gold-400/50 animate-spin" />
      <span className="tracking-[0.5em] uppercase text-[10px] text-white/20 font-light">Loading</span>
    </div>
  );

  return (
    <div className="w-full bg-black">

      {/* ═══════════════════ SCROLL FRAMES HERO ═══════════════════ */}
      <ScrollFrames scrollHeight="600vh" />

      {/* ═══════════════════ BRAND INTRO ═══════════════════ */}
      <section className="py-32 md:py-44 border-t border-white/[0.03]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <p className="text-[10px] tracking-[0.5em] uppercase text-gold-400/40 mb-6">Inspired by Time</p>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light leading-[1.3] text-white/70 italic mb-8">
            "Where precision engineering meets timeless elegance"
          </h2>
          <p className="text-white/20 text-sm tracking-[0.1em] font-light max-w-xl mx-auto leading-relaxed">
            Arab Times brings the world's most desired luxury aesthetics within your reach.
            Every timepiece tells a story of meticulous craftsmanship.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="w-8 h-px bg-gold-400/20" />
            <span className="text-[9px] tracking-[0.4em] uppercase text-gold-400/30">Colachel, Tamil Nadu</span>
            <div className="w-8 h-px bg-gold-400/20" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ FEATURED COLLECTION ═══════════════════ */}
      <section className="relative pb-32 md:pb-44">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20 md:mb-28"
          >
            <p className="text-[10px] tracking-[0.5em] uppercase text-gold-400/50 mb-4">Featured</p>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-wide text-white/90">
              The Collection
            </h2>
          </motion.div>

          {/* Editorial grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {featuredWatches.map((watch, i) => (
              <motion.div
                key={watch.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`${i === 0 ? "md:col-span-2 md:aspect-[21/9]" : "aspect-[4/5] md:aspect-[3/4]"}`}
              >
                <Link
                  to={`/product/${watch.id}`}
                  className="group relative block w-full h-full bg-[#060606] overflow-hidden"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={watch.images[0]}
                      alt={watch.name}
                      className={`object-contain transition-transform duration-[1.2s] ease-out group-hover:scale-105 ${
                        i === 0 ? "h-[70%] md:h-[85%]" : "h-[75%]"
                      }`}
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                  {watch.trending && (
                    <span className="absolute top-6 left-6 z-10 text-[9px] tracking-[0.3em] uppercase text-gold-400/80 border border-gold-400/20 px-3 py-1.5">
                      Trending
                    </span>
                  )}
                  {watch.discount && (
                    <span className="absolute top-6 right-6 z-10 text-[9px] tracking-[0.2em] uppercase text-white/60 bg-white/[0.06] backdrop-blur-sm px-3 py-1.5">
                      {watch.discount}% Off
                    </span>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="font-display text-xl md:text-2xl text-white/90 font-light tracking-wide mb-1 line-clamp-1">
                          {watch.name}
                        </h3>
                        <p className="text-gold-400/70 text-sm tracking-wider font-light">
                          ₹{watch.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <span className="text-[10px] tracking-[0.3em] uppercase text-white/0 group-hover:text-white/40 transition-all duration-500 flex items-center gap-2 translate-y-2 group-hover:translate-y-0">
                        Discover <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-16 md:mt-24"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.4em] uppercase text-white/30 hover:text-white/70 border-b border-white/[0.06] hover:border-white/20 pb-2 transition-all duration-500 group"
            >
              View All Timepieces
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ VALUE PROPOSITIONS ═══════════════════ */}
      <section className="py-24 border-t border-white/[0.03]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {[
            { title: "Authenticity", desc: "Every timepiece verified and guaranteed genuine" },
            { title: "Free Shipping", desc: "Complimentary insured delivery worldwide" },
            { title: "Premium Quality", desc: "Handpicked luxury that stands the test of time" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="text-center"
            >
              <h4 className="font-display text-2xl font-light text-white/70 mb-3 tracking-wide">{item.title}</h4>
              <p className="text-white/20 text-xs tracking-[0.1em] font-light leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
