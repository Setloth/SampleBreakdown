import React, { useMemo } from "react";
import { Disc3 } from "lucide-react";
import "./sample-breakdown.css"; // reuses --sbs-* tokens and .sbs-vinyl styling
import "./hero.css";

// A generative, non-audio-driven waveform shape — layered sine waves with a
// touch of randomness so it looks organic rather than obviously synthetic.
// This is purely decorative, so there's no reason to decode a real file.
function generateBars(count, seed) {
  const bars = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const v = Math.abs(
      Math.sin(t * 14 + seed) * 0.55 +
      Math.sin(t * 37 - seed * 2) * 0.25 +
      Math.sin(t * 5.3 + seed) * 0.2
    );
    bars.push(Math.min(1, 0.15 + v));
  }
  return bars;
}

function WaveformFiller({ flip = false }) {
  const bars = useMemo(() => generateBars(60, flip ? 2.7 : 1.1), [flip]);
  return (
    <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="hero-wave-svg">
      {bars.map((h, i) => {
        const w = 300 / bars.length;
        const barH = h * 64;
        const x = flip ? 300 - (i + 1) * w : i * w;
        // Fade toward the outer edge, away from the record, so the bars
        // read as trailing off rather than just stopping abruptly.
        const distFromCenter = flip ? i / bars.length : 1 - i / bars.length;
        const opacity = 0.25 + distFromCenter * 0.55;
        return (
          <rect
            key={i}
            x={x}
            y={(80 - barH) / 2}
            width={Math.max(w - 1, 0.6)}
            height={barH}
            className="hero-bar"
            style={{ opacity }}
          />
        );
      })}
    </svg>
  );
}

// <SamplingHero>your blurb paragraph as children</SamplingHero>
export default function SamplingHero({ children }) {
  return (
    <div className="sampling-hero">
      <div className="sampling-hero-row">
        <div className="sampling-hero-wave"><WaveformFiller /></div>
        <div className="sbs-vinyl sampling-hero-vinyl sbs-vinyl-spin-slow">
          <div className="sbs-vinyl-label"><Disc3 size={22} strokeWidth={1.4} /></div>
        </div>
        <div className="sampling-hero-wave"><WaveformFiller flip /></div>
      </div>
      {children && <p className="sampling-hero-blurb">{children}</p>}
    </div>
  );
}