import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { db } from "../lib/firebase";
import { collection, query, limit, getDocs, where } from "firebase/firestore";
import type { Product } from "../types";

const Scene3D = lazy(() => import("../components/ui/Scene3D").then(m => ({ default: m.Scene3D })));

export const Home = () => {
  const [featuredWatches, setFeaturedWatches] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);

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

      {/* ═══════════════════ HERO — FULL VIEWPORT ═══════════════════ */}
      <motion.section
        ref={heroRef}
        className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {/* 3D scene as atmospheric background */}
        <Suspense fallback={null}>
          <div className="absolute inset-0 opacity-40">
            <Scene3D />
          </div>
        </Suspense>

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_70%)] z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-[1]" />

        {/* Hero content */}
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] md:text-xs tracking-[0.6em] uppercase text-white/30 font-light mb-8"
          >
            Inspired by Time
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.9] font-light tracking-[0.02em] mb-6"
          >
            <span className="text-gradient-gold">Arab</span>
            <br />
            <span className="text-white/90">Times</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-white/25 text-sm md:text-base font-extralight tracking-[0.15em] max-w-md mx-auto mb-12"
          >
            Where elegance meets precision
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.4em] uppercase text-white/50 hover:text-white border-b border-white/10 hover:border-white/40 pb-2 transition-all duration-500 group"
            >
              Explore Collection
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"
          />
        </motion.div>
      </motion.section>

      {/* ═══════════════════ FEATURED COLLECTION ═══════════════════ */}
      <section className="relative py-32 md:py-44">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20 md:mb-28"
          >
            <p className="text-[10px] tracking-[0.5em] uppercase text-gold-400/60 mb-4">Featured</p>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-wide text-white/90">
              The Collection
            </h2>
          </motion.div>

          {/* Editorial grid — alternating large/small */}
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
                  className="group relative block w-full h-full bg-[#080808] overflow-hidden"
                >
                  {/* Product image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={watch.images[0]}
                      alt={watch.name}
                      className={`object-contain transition-transform duration-[1.2s] ease-out group-hover:scale-105 ${
                        i === 0 ? "h-[70%] md:h-[85%]" : "h-[75%]"
                      }`}
                    />
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                  {/* Badges */}
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

                  {/* Bottom info */}
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

          {/* View all link */}
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

      {/* ═══════════════════ BRAND STATEMENT ═══════════════════ */}
      <section className="relative py-40 md:py-56 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <img src="/watch3.png" alt="" className="w-full h-full object-cover" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-gold-400/30 to-transparent mx-auto mb-12" />

          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light leading-[1.3] text-white/80 italic">
            "Experience the pinnacle of horological craftsmanship"
          </h2>

          <p className="mt-8 text-white/20 text-sm tracking-[0.2em] font-light max-w-xl mx-auto leading-relaxed">
            Arab Times brings the world's most desired luxury aesthetics within your reach.
            Every timepiece tells a story of precision and elegance.
          </p>

          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="w-8 h-px bg-gold-400/30" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold-400/40 font-light">
              Colachel, Tamil Nadu
            </span>
            <div className="w-8 h-px bg-gold-400/30" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ VALUE PROPOSITIONS ═══════════════════ */}
      <section className="py-24 border-t border-white/[0.04]">
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
