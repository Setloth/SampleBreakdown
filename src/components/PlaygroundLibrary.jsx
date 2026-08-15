import React from "react";
import "./playground-library.css";

// <PlaygroundLibrary library={playgroundLibrary} onSelect={(clip) => ...} activeId={selected?.id} />
// clip shape: { id, title, file }
export default function PlaygroundLibrary({ library, onSelect, activeId }) {
  return (
    <div className="pgl-root">
      {library.map((group) => (
        <div className="pgl-group" key={group.category}>
          <span className="pgl-eyebrow">{group.category}</span>
          <div className="pgl-clips">
            {group.clips.map((clip) => (
              <button
                type="button"
                key={clip.id}
                className={`pgl-clip ${activeId === clip.id ? "pgl-clip-active" : ""}`}
                onClick={() => onSelect(clip)}
              >
                {clip.title}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}