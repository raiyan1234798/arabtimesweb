import { useRef, useEffect, useCallback } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface ScrollVideoProps {
  src: string;
  scrollHeight?: string;
}

/**
 * Scroll-driven video component.
 * The video scrubs forward/backward based on scroll position.
 * Stays sticky in the viewport while container provides scroll room.
 */
export const ScrollVideo = ({ src, scrollHeight = "600vh" }: ScrollVideoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smoothly update video currentTime based on scroll
  const updateVideoTime = useCallback((progress: number) => {
    const video = videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;
    const targetTime = progress * video.duration;
    // Only update if there's a meaningful difference (avoid jank)
    if (Math.abs(video.currentTime - targetTime) > 0.03) {
      video.currentTime = targetTime;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => updateVideoTime(v));
    });
    return () => {
      unsubscribe();
      cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress, updateVideoTime]);

  // Preload video metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.preload = "auto";
    // Force load first frame
    video.currentTime = 0;
  }, []);

  // Text overlays driven by scroll
  const introOpacity = useTransform(scrollYProgress, [0, 0.04, 0.12], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.12], [0, -40]);

  const midOpacity = useTransform(scrollYProgress, [0.3, 0.38, 0.52, 0.6], [0, 1, 1, 0]);
  const midY = useTransform(scrollYProgress, [0.3, 0.38, 0.52, 0.6], [30, 0, 0, -30]);

  const endOpacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95], [0, 1, 1]);
  const endY = useTransform(scrollYProgress, [0.75, 0.85], [30, 0]);

  // Progress bar
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative" style={{ height: scrollHeight }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Video */}
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center center" }}
        />

        {/* Subtle vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)] pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none" />

        {/* ── Intro text ── */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none px-6"
        >
          <p className="text-[10px] md:text-xs tracking-[0.6em] uppercase text-white/30 font-light mb-6">
            Scroll to Explore
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.02em] text-white/90 mb-4">
            <span className="text-gradient-gold">Arab</span> Times
          </h1>
          <p className="text-white/20 text-sm md:text-base tracking-[0.2em] font-extralight">
            Inspired by the impossible
          </p>
        </motion.div>

        {/* ── Mid text ── */}
        <motion.div
          style={{ opacity: midOpacity, y: midY }}
          className="absolute z-20 left-8 md:left-16 bottom-24 md:bottom-32 pointer-events-none"
        >
          <p className="text-[9px] tracking-[0.4em] uppercase text-gold-400/50 mb-2">Craftsmanship</p>
          <h2 className="font-display text-2xl md:text-4xl font-light text-white/80 tracking-wide">
            Precision in Every Detail
          </h2>
          <p className="text-white/20 text-xs md:text-sm tracking-wider font-light mt-2 max-w-sm">
            Every component assembled with meticulous attention
          </p>
        </motion.div>

        {/* ── End text ── */}
        <motion.div
          style={{ opacity: endOpacity, y: endY }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none px-6"
        >
          <p className="text-[9px] tracking-[0.4em] uppercase text-gold-400/40 mb-4">The Collection</p>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-white/90 tracking-wide mb-6">
            Discover Your Timepiece
          </h2>
          <a
            href="/shop"
            className="inline-flex items-center gap-3 text-[11px] tracking-[0.4em] uppercase text-white/50 hover:text-white border-b border-white/10 hover:border-white/40 pb-2 transition-all duration-500 pointer-events-auto"
          >
            Explore Collection
          </a>
        </motion.div>

        {/* ── Scroll progress ── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-px bg-white/[0.06] z-20 overflow-hidden">
          <motion.div className="h-full bg-gold-400/40" style={{ width: progressWidth }} />
        </div>
      </div>
    </div>
  );
};
