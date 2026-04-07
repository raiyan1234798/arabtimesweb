import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Gem, Shield, Truck, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { db } from "../lib/firebase";
import { collection, query, limit, getDocs, where } from "firebase/firestore";
import { TiltCard } from "../components/ui/TiltCard";
import type { Product } from "../types";

const Scene3D = lazy(() => import("../components/ui/Scene3D").then(m => ({ default: m.Scene3D })));

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export const Home = () => {
  const [featuredWatches, setFeaturedWatches] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

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
      <div className="relative">
        <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
        <div className="absolute inset-0 blur-xl bg-gold-500/20 rounded-full" />
      </div>
      <span className="tracking-[0.4em] uppercase text-xs text-white/40 font-light">Loading Collections...</span>
    </div>
  );

  return (
    <div className="w-full overflow-hidden">
      {/* HERO SECTION WITH 3D */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-dark-950"
      >
        {/* 3D Background Scene */}
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/40 via-transparent to-dark-950 z-[1] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,3,3,0.6)_70%)] z-[1] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 text-center flex flex-col items-center px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-6"
          >
            <span className="text-gold-500/80 tracking-[0.5em] uppercase text-[10px] md:text-xs font-light border border-gold-500/20 px-6 py-2 rounded-full backdrop-blur-sm">
              Luxury Timepieces
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4"
          >
            <span className="text-white">Arab</span>
            <span className="text-gradient-gold"> Times</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-white/40 text-base md:text-xl font-light tracking-widest max-w-lg mb-10 leading-relaxed"
          >
            Where elegance meets precision. Discover timepieces crafted for the extraordinary.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex gap-4"
          >
            <Link to="/shop">
              <Button size="lg" className="rounded-full text-sm md:text-base px-8 md:px-10 py-5 md:py-6 uppercase tracking-[0.2em] font-semibold">
                Explore Collection <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-gradient-to-b from-gold-500/50 to-transparent"
          />
        </motion.div>
      </motion.section>

      {/* FEATURED / TRENDING SECTION */}
      <section className="py-24 md:py-36 px-6 max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-gold-500/30 to-transparent" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-4"
        >
          <div>
            <motion.span variants={fadeUp} custom={0} className="text-gold-500 font-medium tracking-[0.3em] uppercase text-[10px] md:text-xs mb-3 block">
              Curated Selection
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl font-light tracking-tight">
              Trending <em className="font-semibold italic text-gradient-gold">Now</em>
            </motion.h2>
          </div>
          <motion.div variants={fadeUp} custom={2}>
            <Link to="/shop" className="flex items-center gap-2 text-white/40 hover:text-gold-500 transition-colors uppercase tracking-[0.2em] text-xs font-medium group">
              View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredWatches.map((watch, i) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              key={watch.id}
            >
              <TiltCard className="group">
                <div className="relative glass rounded-2xl overflow-hidden hover-glow transition-all duration-500 hover:border-gold-500/30">
                  {watch.trending && (
                    <div className="absolute top-4 left-4 z-20 bg-gold-500/90 backdrop-blur-sm text-black text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
                      Trending
                    </div>
                  )}
                  {watch.newArrival && (
                    <div className="absolute top-4 left-4 z-20 glass-strong text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
                      New
                    </div>
                  )}
                  {watch.discount && (
                    <div className="absolute top-4 right-4 z-20 bg-red-500/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full">
                      -{watch.discount}%
                    </div>
                  )}

                  <Link to={`/product/${watch.id}`} className="block relative aspect-[4/5] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent z-10 opacity-80" />
                    <img
                      src={watch.images[0]}
                      alt={watch.name}
                      className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h4 className="font-display text-lg md:text-xl text-white mb-2 group-hover:text-gold-400 transition-colors line-clamp-1">
                        {watch.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <p className="text-gold-500 font-semibold text-lg tracking-wider">
                          ₹{watch.price.toLocaleString("en-IN")}
                        </p>
                        <span className="text-white/0 group-hover:text-white/60 transition-all duration-500 text-xs tracking-[0.2em] uppercase flex items-center gap-1">
                          View <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES / USP STRIP */}
      <section className="relative py-20 border-y border-white/[0.05]">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-900 to-dark-950" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Shield, title: "Authenticity Guaranteed", desc: "Every timepiece verified by our expert horologists" },
            { icon: Truck, title: "Insured Shipping", desc: "Free premium delivery with full insurance coverage" },
            { icon: Gem, title: "Premium Quality", desc: "Handpicked luxury aesthetics that stand the test of time" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-5 group-hover:border-gold-500/30 transition-colors">
                <item.icon className="w-7 h-7 text-gold-500" />
              </div>
              <h4 className="font-display text-lg text-white mb-2 tracking-wide">{item.title}</h4>
              <p className="text-white/40 text-sm font-light leading-relaxed max-w-xs">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BRAND QUOTE / PARALLAX */}
      <section className="relative py-32 md:py-44 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <img src="/watch3.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-3xl px-6"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold-500/50 to-transparent mx-auto mb-10" />
          <p className="font-display text-2xl md:text-4xl font-light leading-relaxed text-white/80 italic">
            "Experience the pinnacle of horological craftsmanship. Arab Times brings the world's most desired luxury aesthetics within your reach."
          </p>
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="w-8 h-px bg-gold-500/50" />
            <span className="text-gold-500/60 tracking-[0.3em] text-[10px] md:text-xs uppercase font-medium">
              Colachel, Tamil Nadu
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
