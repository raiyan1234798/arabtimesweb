import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const TOTAL_FRAMES = 153;
const FRAME_PATH = "/frames/frame-";
const PRELOAD_AHEAD = 10; // Load 10 frames ahead/behind current position

/** Pads number to 3 digits: 1 → "001" */
const pad = (n: number) => String(n).padStart(3, "0");

/** Builds frame URL */
const frameUrl = (i: number) => `${FRAME_PATH}${pad(i)}.jpg`;

interface ScrollFramesProps {
  scrollHeight?: string;
}

/**
 * Canvas-based scroll-driven frame sequence.
 * Progressively loads frames near the current scroll position
 * instead of preloading all 153 frames at once.
 */
export const ScrollFrames = ({ scrollHeight = "600vh" }: ScrollFramesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadingRef = useRef<Set<number>>(new Set());
  const [initialReady, setInitialReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const currentFrameRef = useRef(0);
  const loadedCountRef = useRef(0);
  const mountedRef = useRef(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── Draw a frame on the canvas ──
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img) return;

    if (canvas.width !== img.naturalWidth) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, []);

  // ── Load a single frame ──
  const loadFrame = useCallback((index: number): Promise<void> => {
    return new Promise((resolve) => {
      if (index < 0 || index >= TOTAL_FRAMES) { resolve(); return; }
      if (imagesRef.current[index] || loadingRef.current.has(index)) { resolve(); return; }

      loadingRef.current.add(index);
      const img = new Image();
      img.src = frameUrl(index + 1); // frames are 1-indexed
      img.onload = () => {
        if (!mountedRef.current) { resolve(); return; }
        imagesRef.current[index] = img;
        loadingRef.current.delete(index);
        loadedCountRef.current++;
        setLoadProgress(loadedCountRef.current / TOTAL_FRAMES);
        resolve();
      };
      img.onerror = () => {
        loadingRef.current.delete(index);
        resolve();
      };
    });
  }, []);

  // ── Load frames around a given index ──
  const loadNearbyFrames = useCallback((centerIndex: number) => {
    const start = Math.max(0, centerIndex - PRELOAD_AHEAD);
    const end = Math.min(TOTAL_FRAMES - 1, centerIndex + PRELOAD_AHEAD);
    for (let i = start; i <= end; i++) {
      loadFrame(i);
    }
  }, [loadFrame]);

  // ── Initial load: first batch of frames for instant display ──
  useEffect(() => {
    mountedRef.current = true;
    const initialBatch = Math.min(20, TOTAL_FRAMES);

    const loadInitial = async () => {
      const promises: Promise<void>[] = [];
      for (let i = 0; i < initialBatch; i++) {
        promises.push(loadFrame(i));
      }
      await Promise.all(promises);
      if (mountedRef.current) {
        setInitialReady(true);
        drawFrame(0);
      }
    };

    loadInitial();

    // Continue loading remaining frames in background
    const loadRest = async () => {
      for (let i = initialBatch; i < TOTAL_FRAMES; i++) {
        if (!mountedRef.current) break;
        await loadFrame(i);
      }
    };

    // Start background loading after initial batch
    const timer = setTimeout(loadRest, 100);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      // Clean up image references to free memory
      imagesRef.current.forEach((img) => {
        if (img) img.src = "";
      });
      imagesRef.current = new Array(TOTAL_FRAMES).fill(null);
      loadingRef.current.clear();
    };
  }, [loadFrame, drawFrame]);

  // ── Listen to scroll and update frame ──
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (!initialReady) return;
      const frameIndex = Math.min(
        Math.floor(progress * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1
      );
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        // Load nearby frames progressively
        loadNearbyFrames(frameIndex);
        // Draw if frame is available
        if (imagesRef.current[frameIndex]) {
          requestAnimationFrame(() => drawFrame(frameIndex));
        }
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, initialReady, drawFrame, loadNearbyFrames]);

  // ── Text overlays driven by scroll ──
  const introOpacity = useTransform(scrollYProgress, [0, 0.03, 0.12], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.12], [0, -50]);

  const midOpacity = useTransform(scrollYProgress, [0.28, 0.35, 0.5, 0.58], [0, 1, 1, 0]);
  const midY = useTransform(scrollYProgress, [0.28, 0.35], [30, 0]);

  const lateOpacity = useTransform(scrollYProgress, [0.55, 0.62, 0.72, 0.78], [0, 1, 1, 0]);
  const lateY = useTransform(scrollYProgress, [0.55, 0.62], [30, 0]);

  const endOpacity = useTransform(scrollYProgress, [0.82, 0.90, 1], [0, 1, 1]);
  const endY = useTransform(scrollYProgress, [0.82, 0.90], [30, 0]);

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative" style={{ height: scrollHeight }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center">

        {/* ── Loading overlay ── */}
        {!initialReady && (
          <div className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center gap-6">
            <div className="w-32 h-px bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-gold-400/50 transition-all duration-300"
                style={{ width: `${loadProgress * 100}%` }}
              />
            </div>
            <span className="text-[9px] tracking-[0.5em] uppercase text-white/15">
              {Math.round(loadProgress * 100)}%
            </span>
          </div>
        )}

        {/* ── Canvas ── */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />

        {/* ── Cinematic overlays ── */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)] pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />

        {/* ── Intro text ── */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none px-6"
        >
          <p className="text-[10px] md:text-xs tracking-[0.6em] uppercase text-white/25 font-light mb-6">
            Scroll to Explore
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.02em] text-white/90 mb-4">
            <span className="text-gradient-gold">Arab</span> Times
          </h1>
          <p className="text-white/15 text-sm md:text-base tracking-[0.25em] font-extralight uppercase">
            Inspired by the impossible
          </p>
        </motion.div>

        {/* ── Mid text ── */}
        <motion.div
          style={{ opacity: midOpacity, y: midY }}
          className="absolute z-20 left-8 md:left-16 bottom-28 md:bottom-36 pointer-events-none"
        >
          <p className="text-[9px] tracking-[0.4em] uppercase text-gold-400/40 mb-2">Craftsmanship</p>
          <h2 className="font-display text-2xl md:text-4xl font-light text-white/80 tracking-wide">
            Precision in Every Detail
          </h2>
        </motion.div>

        {/* ── Late text ── */}
        <motion.div
          style={{ opacity: lateOpacity, y: lateY }}
          className="absolute z-20 right-8 md:right-16 bottom-28 md:bottom-36 pointer-events-none text-right"
        >
          <p className="text-[9px] tracking-[0.4em] uppercase text-gold-400/40 mb-2">Engineering</p>
          <h2 className="font-display text-2xl md:text-4xl font-light text-white/80 tracking-wide">
            Built to Last Forever
          </h2>
        </motion.div>

        {/* ── End CTA ── */}
        <motion.div
          style={{ opacity: endOpacity, y: endY }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-white/90 tracking-wide mb-8">
            Discover the Collection
          </h2>
          <a
            href="/shop"
            className="inline-flex items-center gap-3 text-[11px] tracking-[0.4em] uppercase text-white/40 hover:text-white border-b border-white/10 hover:border-white/40 pb-2 transition-all duration-500 pointer-events-auto"
          >
            Explore Timepieces
          </a>
        </motion.div>

        {/* ── Progress bar ── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-px bg-white/[0.04] z-20 overflow-hidden">
          <motion.div className="h-full bg-gold-400/30" style={{ width: progressWidth }} />
        </div>
      </div>
    </div>
  );
};
