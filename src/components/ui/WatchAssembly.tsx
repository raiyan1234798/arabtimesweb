import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-driven mechanical watch assembly.
 * As the user scrolls through 500vh, individual watch parts
 * fly in from different directions and lock into place,
 * with text labels appearing at each stage.
 */
export const WatchAssembly = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── Part transforms (each part has entry range) ──────────────
  // Case body: 0.00 → 0.15
  const caseY = useTransform(scrollYProgress, [0, 0.12], [300, 0]);
  const caseOpacity = useTransform(scrollYProgress, [0, 0.10], [0, 1]);
  const caseScale = useTransform(scrollYProgress, [0, 0.12], [0.6, 1]);

  // Dial face: 0.12 → 0.25
  const dialScale = useTransform(scrollYProgress, [0.12, 0.24], [0.3, 1]);
  const dialOpacity = useTransform(scrollYProgress, [0.12, 0.22], [0, 1]);
  const dialRotate = useTransform(scrollYProgress, [0.12, 0.24], [180, 0]);

  // Bezel ring: 0.22 → 0.35
  const bezelScale = useTransform(scrollYProgress, [0.22, 0.34], [1.8, 1]);
  const bezelOpacity = useTransform(scrollYProgress, [0.22, 0.32], [0, 1]);
  const bezelRotate = useTransform(scrollYProgress, [0.22, 0.34], [-90, 0]);

  // Hour markers: 0.30 → 0.42
  const markersOpacity = useTransform(scrollYProgress, [0.30, 0.40], [0, 1]);
  const markersScale = useTransform(scrollYProgress, [0.30, 0.40], [0.5, 1]);

  // Watch hands: 0.38 → 0.52
  const handsOpacity = useTransform(scrollYProgress, [0.38, 0.48], [0, 1]);
  const hourRotate = useTransform(scrollYProgress, [0.38, 0.50], [-120, -30]);
  const minuteRotate = useTransform(scrollYProgress, [0.38, 0.50], [-200, 60]);
  const secondRotate = useTransform(scrollYProgress, [0.40, 0.52], [360, 180]);

  // Crown: 0.48 → 0.60
  const crownX = useTransform(scrollYProgress, [0.48, 0.58], [120, 0]);
  const crownOpacity = useTransform(scrollYProgress, [0.48, 0.56], [0, 1]);

  // Strap top: 0.56 → 0.68
  const strapTopY = useTransform(scrollYProgress, [0.56, 0.67], [-250, 0]);
  const strapTopOpacity = useTransform(scrollYProgress, [0.56, 0.65], [0, 1]);

  // Strap bottom: 0.62 → 0.74
  const strapBottomY = useTransform(scrollYProgress, [0.62, 0.73], [250, 0]);
  const strapBottomOpacity = useTransform(scrollYProgress, [0.62, 0.71], [0, 1]);

  // Final glow: 0.74 → 0.85
  const glowOpacity = useTransform(scrollYProgress, [0.74, 0.85], [0, 0.6]);
  const finalScale = useTransform(scrollYProgress, [0.74, 0.85], [1, 1.02]);

  // ── Text stage transforms ──────────────────────────────────
  const stageTexts = [
    { label: "The Case", sub: "Precision-machined stainless steel body", range: [0.04, 0.10, 0.16] as const },
    { label: "The Dial", sub: "Hand-finished sunburst face", range: [0.16, 0.22, 0.28] as const },
    { label: "The Bezel", sub: "Unidirectional rotating ceramic insert", range: [0.26, 0.32, 0.38] as const },
    { label: "The Movement", sub: "Swiss-inspired mechanical precision", range: [0.40, 0.46, 0.54] as const },
    { label: "The Crown", sub: "Screw-down for water resistance", range: [0.50, 0.56, 0.62] as const },
    { label: "The Strap", sub: "Premium Italian leather band", range: [0.60, 0.66, 0.74] as const },
    { label: "Complete", sub: "A masterpiece, assembled", range: [0.78, 0.84, 0.95] as const },
  ];

  return (
    <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black">

        {/* ── SVG Watch ── */}
        <motion.div style={{ scale: finalScale }} className="relative w-[280px] h-[500px] md:w-[340px] md:h-[600px]">
          <svg
            viewBox="0 0 340 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* ═══ STRAP TOP ═══ */}
            <motion.g style={{ y: strapTopY, opacity: strapTopOpacity }}>
              <path
                d="M130 240 L130 60 Q130 40 145 38 L195 38 Q210 40 210 60 L210 240"
                fill="#1a1510"
                stroke="#2a2218"
                strokeWidth="1"
              />
              {/* Strap stitching */}
              <line x1="140" y1="80" x2="140" y2="220" stroke="#3a3020" strokeWidth="0.5" strokeDasharray="6 4" />
              <line x1="200" y1="80" x2="200" y2="220" stroke="#3a3020" strokeWidth="0.5" strokeDasharray="6 4" />
              {/* Strap holes */}
              {[100, 130, 160, 190].map((cy) => (
                <ellipse key={cy} cx="170" cy={cy} rx="4" ry="5" fill="#0a0806" stroke="#2a2218" strokeWidth="0.5" />
              ))}
            </motion.g>

            {/* ═══ STRAP BOTTOM ═══ */}
            <motion.g style={{ y: strapBottomY, opacity: strapBottomOpacity }}>
              <path
                d="M130 360 L130 540 Q130 560 145 562 L195 562 Q210 560 210 540 L210 360"
                fill="#1a1510"
                stroke="#2a2218"
                strokeWidth="1"
              />
              <line x1="140" y1="380" x2="140" y2="530" stroke="#3a3020" strokeWidth="0.5" strokeDasharray="6 4" />
              <line x1="200" y1="380" x2="200" y2="530" stroke="#3a3020" strokeWidth="0.5" strokeDasharray="6 4" />
              {/* Buckle */}
              <rect x="148" y="520" width="44" height="18" rx="3" fill="none" stroke="#d4af37" strokeWidth="1.2" opacity="0.6" />
              <line x1="170" y1="522" x2="170" y2="536" stroke="#d4af37" strokeWidth="1" opacity="0.5" />
            </motion.g>

            {/* ═══ CASE BODY ═══ */}
            <motion.g style={{ y: caseY, opacity: caseOpacity, scale: caseScale }}>
              {/* Lug top left */}
              <path d="M130 258 L118 240 Q115 235 118 232 L132 240 Z" fill="#b8941f" opacity="0.7" />
              {/* Lug top right */}
              <path d="M210 258 L222 240 Q225 235 222 232 L208 240 Z" fill="#b8941f" opacity="0.7" />
              {/* Lug bottom left */}
              <path d="M130 342 L118 360 Q115 365 118 368 L132 360 Z" fill="#b8941f" opacity="0.7" />
              {/* Lug bottom right */}
              <path d="M210 342 L222 360 Q225 365 222 368 L208 360 Z" fill="#b8941f" opacity="0.7" />

              {/* Main case */}
              <circle cx="170" cy="300" r="82" fill="#1a1a1a" stroke="#b8941f" strokeWidth="2" />
              {/* Case inner ring */}
              <circle cx="170" cy="300" r="78" fill="#111" stroke="#8a7420" strokeWidth="0.5" />
            </motion.g>

            {/* ═══ DIAL FACE ═══ */}
            <motion.g style={{ scale: dialScale, opacity: dialOpacity, rotate: dialRotate }} className="origin-center">
              <circle cx="170" cy="300" r="72" fill="#0a0a0a" />
              {/* Sunburst pattern - radial lines */}
              {Array.from({ length: 60 }).map((_, i) => {
                const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
                const x1 = 170 + Math.cos(angle) * 30;
                const y1 = 300 + Math.sin(angle) * 30;
                const x2 = 170 + Math.cos(angle) * 70;
                const y2 = 300 + Math.sin(angle) * 70;
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1a1a" strokeWidth="0.3" opacity="0.5" />
                );
              })}
              {/* Inner circle */}
              <circle cx="170" cy="300" r="68" fill="none" stroke="#333" strokeWidth="0.3" />
            </motion.g>

            {/* ═══ BEZEL RING ═══ */}
            <motion.g style={{ scale: bezelScale, opacity: bezelOpacity, rotate: bezelRotate }} className="origin-center">
              <circle cx="170" cy="300" r="76" fill="none" stroke="#d4af37" strokeWidth="2.5" />
              <circle cx="170" cy="300" r="74" fill="none" stroke="#9a7c1a" strokeWidth="0.5" />
              {/* Bezel minute marks */}
              {Array.from({ length: 120 }).map((_, i) => {
                const angle = (i / 120) * Math.PI * 2 - Math.PI / 2;
                const r1 = i % 10 === 0 ? 72 : 74;
                const r2 = 76;
                const x1 = 170 + Math.cos(angle) * r1;
                const y1 = 300 + Math.sin(angle) * r1;
                const x2 = 170 + Math.cos(angle) * r2;
                const y2 = 300 + Math.sin(angle) * r2;
                return (
                  <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#d4af37"
                    strokeWidth={i % 10 === 0 ? "1.2" : "0.3"}
                    opacity={i % 10 === 0 ? "0.8" : "0.3"}
                  />
                );
              })}
            </motion.g>

            {/* ═══ HOUR MARKERS ═══ */}
            <motion.g style={{ opacity: markersOpacity, scale: markersScale }} className="origin-center">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
                const isMain = i % 3 === 0;
                const r1 = isMain ? 55 : 60;
                const r2 = 66;
                const x1 = 170 + Math.cos(angle) * r1;
                const y1 = 300 + Math.sin(angle) * r1;
                const x2 = 170 + Math.cos(angle) * r2;
                const y2 = 300 + Math.sin(angle) * r2;
                return (
                  <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#d4af37"
                    strokeWidth={isMain ? "2.5" : "1"}
                    strokeLinecap="round"
                    opacity={isMain ? "1" : "0.6"}
                  />
                );
              })}
              {/* ARAB TIMES text on dial */}
              <text x="170" y="272" textAnchor="middle" fill="#d4af37" fontSize="5" fontFamily="Inter" letterSpacing="3" opacity="0.7">
                ARAB TIMES
              </text>
              {/* Date window */}
              <rect x="196" y="295" width="14" height="10" rx="1.5" fill="#0a0a0a" stroke="#333" strokeWidth="0.5" />
              <text x="203" y="303" textAnchor="middle" fill="#d4af37" fontSize="6" fontFamily="Inter" opacity="0.7">
                07
              </text>
            </motion.g>

            {/* ═══ WATCH HANDS ═══ */}
            <motion.g style={{ opacity: handsOpacity }}>
              {/* Hour hand */}
              <motion.line
                x1="170" y1="300" x2="170" y2="260"
                stroke="#d4af37" strokeWidth="3" strokeLinecap="round"
                style={{ rotate: hourRotate, transformOrigin: "170px 300px" }}
              />
              {/* Minute hand */}
              <motion.line
                x1="170" y1="300" x2="170" y2="245"
                stroke="#e8e8e8" strokeWidth="2" strokeLinecap="round"
                style={{ rotate: minuteRotate, transformOrigin: "170px 300px" }}
              />
              {/* Second hand */}
              <motion.g style={{ rotate: secondRotate, transformOrigin: "170px 300px" }}>
                <line x1="170" y1="310" x2="170" y2="242" stroke="#d4af37" strokeWidth="0.7" />
                <circle cx="170" cy="242" r="1.5" fill="#d4af37" />
              </motion.g>
              {/* Center pin */}
              <circle cx="170" cy="300" r="4" fill="#d4af37" />
              <circle cx="170" cy="300" r="2" fill="#111" />
            </motion.g>

            {/* ═══ CROWN ═══ */}
            <motion.g style={{ x: crownX, opacity: crownOpacity }}>
              <rect x="250" y="292" width="18" height="16" rx="3" fill="#b8941f" opacity="0.9" />
              <rect x="252" y="294" width="14" height="12" rx="2" fill="none" stroke="#d4af37" strokeWidth="0.5" />
              {/* Crown grip lines */}
              {[296, 299, 302].map(y => (
                <line key={y} x1="254" y1={y} x2="264" y2={y} stroke="#9a7c1a" strokeWidth="0.5" />
              ))}
              {/* Crown stem */}
              <rect x="246" y="296" width="6" height="8" fill="#8a7420" />
            </motion.g>

            {/* ═══ FINAL GLOW ═══ */}
            <motion.circle
              cx="170" cy="300" r="90"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1"
              style={{ opacity: glowOpacity }}
              filter="url(#glow)"
            />

            {/* Glow filter */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </motion.div>

        {/* ── Stage Text Labels ── */}
        {stageTexts.map((stage) => (
          <StageLabel
            key={stage.label}
            label={stage.label}
            sub={stage.sub}
            scrollYProgress={scrollYProgress}
            fadeIn={stage.range[0]}
            show={stage.range[1]}
            fadeOut={stage.range[2]}
          />
        ))}

        {/* ── Scroll progress bar ── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-px bg-white/[0.06] overflow-hidden"
        >
          <motion.div
            className="h-full bg-gold-400/40"
            style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
          />
        </motion.div>

        {/* Scroll hint at very top */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.04], [1, 0]) }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] tracking-[0.4em] uppercase text-white/15">Scroll to assemble</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-white/15 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
};

/** Fades a text label in and out based on scroll progress */
const StageLabel = ({
  label,
  sub,
  scrollYProgress,
  fadeIn,
  show,
  fadeOut,
}: {
  label: string;
  sub: string;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  fadeIn: number;
  show: number;
  fadeOut: number;
}) => {
  const opacity = useTransform(
    scrollYProgress,
    [fadeIn, show, fadeOut],
    [0, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [fadeIn, show, fadeOut],
    [20, 0, -20]
  );

  const side = label === "The Crown" ? "right" : label === "Complete" ? "center" : "left";

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute z-20 pointer-events-none ${
        side === "center"
          ? "bottom-28 left-1/2 -translate-x-1/2 text-center"
          : side === "right"
          ? "right-8 md:right-[15%] top-1/2 -translate-y-1/2 text-right"
          : "left-8 md:left-[15%] top-1/2 -translate-y-1/2"
      }`}
    >
      <h3
        className={`font-display tracking-wide font-light ${
          label === "Complete"
            ? "text-3xl md:text-5xl text-gradient-gold"
            : "text-xl md:text-3xl text-white/80"
        }`}
      >
        {label}
      </h3>
      <p className="text-[10px] md:text-xs tracking-[0.2em] text-white/20 mt-2 font-light max-w-[200px]">
        {sub}
      </p>
    </motion.div>
  );
};
