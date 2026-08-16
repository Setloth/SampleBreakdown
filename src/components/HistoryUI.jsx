import React from "react";
import "./sample-breakdown.css"; // for --sbs-* tokens
import "./history-ui.css";

// Wraps a run of <NumberedSection>s with a connecting vertical rail, so the
// five history beats read as a continuous tracklist rather than five
// disconnected headings.
export function HistoryTracklist({ children }) {
  return <div className="history-tracklist">{children}</div>;
}

export function NumberedSection({ index, title, children }) {
  const num = String(index).padStart(2, "0");
  return (
    <div className="history-track">
      <div className="history-track-rail">
        <span className="history-track-dot" />
      </div>
      <div className="history-track-number" aria-hidden="true">{num}</div>
      <div className="history-track-body">
        <div className="history-track-label">Track {num}</div>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

// <TechTimeline steps={[{ id, label, era, icon: <SomeIcon/>, image: "/x.jpg", caption }]} />
// Pass either `icon` (a lucide element) or `image` (a URL) per step.
export function TechTimeline({ steps }) {
  return (
    <div className="tech-timeline">
      {steps.map((step, i) => (
        <div className="tech-timeline-step" key={step.id}>
          <div className="tech-timeline-icon">
            {step.image ? <img src={step.image} alt={step.label} /> : step.icon}
          </div>
          <div className="tech-timeline-label">{step.label}</div>
          {step.era && <div className="tech-timeline-era">{step.era}</div>}
          {step.caption && <p className="tech-timeline-caption">{step.caption}</p>}
          {i < steps.length - 1 && <div className="tech-timeline-connector" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}

// Small helper for the [IMAGE] placeholders in your history text — gives
// you consistent captioning/attribution styling for sourced photos.
export function HistoryFigure({ src, alt, caption, sourceHref, sourceLabel, children }) {
  return (
    <figure className="history-figure">
      {children ? children : <img src={src} alt={alt} />}
      
      {(caption || sourceHref) && (
        <figcaption>
          {caption}{caption && sourceHref && " — "}
          {sourceHref && <a href={sourceHref} target="_blank" rel="noreferrer">{sourceLabel || "source"}</a>}
        </figcaption>
      )}
    </figure>
  );
}