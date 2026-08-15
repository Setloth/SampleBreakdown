import React, {
  useState, useRef, useEffect, useCallback, useMemo,
  forwardRef, useImperativeHandle,
} from "react";
import {
  Play, Pause, Repeat, UploadCloud, Disc3, ZoomOut, MapPin,
  SkipForward, RotateCcw, X, Plus,
} from "lucide-react";
import "./sample-breakdown.css";
import { extractPeaks, downsample, formatTime } from "./peaks-util";

// ---------------------------------------------------------------------------
// Registry so prose/content elsewhere on the page can trigger a specific
// <SampleBreakdown id="..."> without holding a ref to it.
// ---------------------------------------------------------------------------
const registry = new Map();

export function triggerSampleBreakdown(id, action = "playLoop", payload) {
  const controller = registry.get(id);
  if (!controller) return;
  if (action === "playMarker") controller.playMarker(payload);
  else if (action === "playFrom") controller.playFrom(payload);
  else if (action === "pause") controller.pause();
  else controller.playLoop();
}

export function SampleTrigger({ target, marker, time, action, children, className = "" }) {
  const resolvedAction = action || (marker ? "playMarker" : time != null ? "playFrom" : "playLoop");
  const payload = marker ?? time;
  return (
    <button
      type="button"
      className={`sbs-trigger ${className}`}
      onClick={() => triggerSampleBreakdown(target, resolvedAction, payload)}
    >
      {children}
    </button>
  );
}

// TODO: universal below-player panel for defining/exporting chops as a
// debug/authoring tool. Unrelated to the playback bug — untouched.
export function SampleControls({ target }) {

}

const TONEARM_OUTER_ANGLE = -12;
const TONEARM_INNER_ANGLE = 9;
const TONEARM_PAUSED_ANGLE = -20;

// ---------------------------------------------------------------------------
// Presentational subcomponents — module scope, stable identity across
// renders (see the earlier fix note if you're wondering why this matters).
// ---------------------------------------------------------------------------
function Panel({ recorder, children }) {
  return (
    <div className={"sbs-panel " + (recorder ? "sbs-panel-recorder" : "")}>
      {children}
    </div>
  );
}

function PanelHeader({ label, title }) {
  const fileName = title ? title.replace(/\.\w+$/gm, "") : title;
  const maxLength = 35;
  const isLong = fileName && fileName.length > maxLength;
  const displayName = isLong ? fileName.slice(0, maxLength - 3) + "..." : fileName;

  return (
    <div className="sbs-panel-head">
      <span className="sbs-eyebrow">{label}</span>
      {fileName && <span className="sbs-filename">{displayName}</span>}
    </div>
  );
}

function Connector() {
  return (
    <div className="sbs-connector">
      <div className="sbs-connector-line" />
      <span className="sbs-connector-arrow">→</span>
    </div>
  );
}

function Grid({ children, single }) {
  return <div className={`sbs-grid ${single ? "sbs-grid-single" : ""}`}>{children}</div>;
}

function SamplePanel({
  label, name, src, onUpload, audioRef, waveRef,
  onWheel, onBgPointerDown, visiblePeaks, overviewPeaks,
  fracToTime, timeToFrac, screenPct, view, setView,
  loop, setLoop, regionRect, playing, playheadPct,
  loopStartPct, loopEndPct, onHandlePointerDown,
  markers, onPlayMarker, onCue, onTogglePlay, onResetZoom, zoomed,
}) {
  return (
    <Panel>
      <PanelHeader label={label} title={name} />

      {!src ? (
        <label className="sbs-drop">
          <UploadCloud size={22} strokeWidth={1.5} />
          <span>Drop or choose the sample source audio</span>
          <input type="file" accept="audio/*" onChange={onUpload} hidden />
        </label>
      ) : (
        <>
          <div
            className="sbs-wave-container"
            ref={waveRef}
            onWheel={onWheel}
            onPointerDown={onBgPointerDown}
          >
            {visiblePeaks && (
              <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="sbs-wave-svg">
                {visiblePeaks.map((p, i) => {
                  const w = 300 / visiblePeaks.length;
                  const x = i * w;
                  const yMax = 50 - p.max * 46;
                  const h = Math.max((p.max - p.min) * 46, 1);
                  const tAtBar = fracToTime(view.start + (i / visiblePeaks.length) * (view.end - view.start));
                  const inLoop = loop.start != null && loop.end != null && tAtBar >= loop.start && tAtBar <= loop.end;
                  return (
                    <rect key={i} x={x} y={yMax} width={Math.max(w - 0.3, 0.4)} height={h}
                      className={inLoop ? "sbs-bar sbs-bar-active" : "sbs-bar"} />
                  );
                })}
              </svg>
            )}

            {regionRect && (
              <div
                className={`sbs-region ${loop.enabled ? "sbs-region-loop" : ""} ${loop.enabled && playing ? "sbs-region-active" : ""}`}
                style={{ left: `${regionRect.left}%`, width: `${regionRect.width}%` }}
              />
            )}

            {playheadPct != null && (
              <div className="sbs-playhead" style={{ left: `${playheadPct}%` }} />
            )}

            {loopStartPct != null && (
              <div className="sbs-handle" style={{ left: `${loopStartPct}%` }}
                onPointerDown={onHandlePointerDown("start")}>
                <div className="sbs-handle-mark" />
              </div>
            )}
            {loopEndPct != null && (
              <div className="sbs-handle" style={{ left: `${loopEndPct}%` }}
                onPointerDown={onHandlePointerDown("end")}>
                <div className="sbs-handle-mark" />
              </div>
            )}

            {markers.map((m) => {
              const pct = screenPct(m.time);
              if (pct == null) return null;
              return (
                <button
                  key={m.id}
                  type="button"
                  className="sbs-marker-pin"
                  style={{ left: `${pct}%` }}
                  title={m.label || m.id}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); onPlayMarker(m.time); }}
                >
                  <MapPin size={12} />
                </button>
              );
            })}
          </div>

          {overviewPeaks && (
            <div
              className="sbs-overview"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const f = (e.clientX - rect.left) / rect.width;
                const span = view.end - view.start;
                let newStart = f - span / 2;
                newStart = Math.min(1 - span, Math.max(0, newStart));
                setView({ start: newStart, end: newStart + span });
              }}
            >
              <svg viewBox="0 0 300 32" preserveAspectRatio="none" className="sbs-overview-svg">
                {overviewPeaks.map((p, i) => {
                  const w = 300 / overviewPeaks.length;
                  const yMax = 16 - p.max * 14;
                  const h = Math.max((p.max - p.min) * 14, 0.6);
                  return <rect key={i} x={i * w} y={yMax} width={Math.max(w - 0.2, 0.3)} height={h} className="sbs-bar" />;
                })}
              </svg>
              {loop.start != null && loop.end != null && (
                <div
                  className="sbs-overview-loop"
                  style={{
                    left: `${timeToFrac(loop.start) * 100}%`,
                    width: `${(timeToFrac(loop.end) - timeToFrac(loop.start)) * 100}%`,
                  }}
                />
              )}
              <div
                className="sbs-overview-window"
                style={{ left: `${view.start * 100}%`, width: `${(view.end - view.start) * 100}%` }}
              />
            </div>
          )}

          <div className="sbs-controls">
            <button className="sbs-btn sbs-btn-icon" onClick={onCue} title="Cue: jump to loop start" aria-label="Cue">
              <SkipForward size={16} />
            </button>
            <button
              className="sbs-btn sbs-btn-primary sbs-btn-icon"
              onClick={onTogglePlay}
              title={playing ? "Pause" : "Play"}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              className={`sbs-btn sbs-btn-icon ${loop.enabled ? "sbs-btn-active" : ""}`}
              onClick={() => setLoop((l) => ({ ...l, enabled: !l.enabled }))}
              title="Toggle loop"
              aria-label="Toggle loop"
            >
              <Repeat size={16} />
              {loop.enabled && <span className="sbs-loop-dot" />}
            </button>
            {zoomed && (
              <button className="sbs-btn sbs-btn-icon" onClick={onResetZoom} title="Reset zoom" aria-label="Reset zoom">
                <ZoomOut size={16} />
              </button>
            )}
            <span className="sbs-time">{formatTime(loop.start)}–{formatTime(loop.end)}</span>
          </div>
        </>
      )}
      <audio ref={audioRef} src={src || undefined} hidden />
    </Panel>
  );
}

function RecordPanel({
  label, name, src, onUpload, audioRef,
  trackPlaying, onTogglePlay, onRestart, armAngle, currentTime, duration, timeMarkers = [],
}) {
  return (
    <Panel recorder>
      <PanelHeader label={label} title={name} />

      <div className="sbs-record-stage">
        <div className="sbs-record-disc">
          <div className={`sbs-vinyl ${trackPlaying ? "sbs-vinyl-spin" : ""}`} onClick={onTogglePlay}>
            <div className="sbs-vinyl-label"><Disc3 size={18} strokeWidth={1.4} /></div>
          </div>
          <div className={`sbs-tonearm-assembly ${trackPlaying ? "sbs-tonearm-down" : "sbs-tonearm-lifted"}`}>
            <div className="sbs-tonearm-pivot" />
            <div className="sbs-tonearm" style={{ transform: `rotate(${trackPlaying ? armAngle : TONEARM_PAUSED_ANGLE}deg)` }} />
          </div>
        </div>
      </div>

      {!src ? (
        <label className="sbs-drop sbs-drop-compact">
          <UploadCloud size={18} strokeWidth={1.5} />
          <span>Choose the track that used the sample</span>
          <input type="file" accept="audio/*" onChange={onUpload} hidden />
        </label>
      ) : (
        <div className="sbs-controls sbs-controls-center">
          <button className="sbs-btn sbs-btn-icon" onClick={onRestart} title="Restart" aria-label="Restart">
            <RotateCcw size={16} />
          </button>
          <button
            className="sbs-btn sbs-btn-primary sbs-btn-icon"
            onClick={onTogglePlay}
            title={trackPlaying ? "Pause" : "Play"}
            aria-label={trackPlaying ? "Pause" : "Play"}
          >
            {trackPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          {timeMarkers.map((mk) => (
            <a
              key={mk}
              className="sbs-time-marker"
              href={`#${mk}_${name}`}
              onClick={(e) => {
                e.preventDefault(); // this is a seek button, not real navigation
                if (audioRef.current) audioRef.current.currentTime = mk;
              }}
            >
              {formatTime(mk)}
            </a>
          ))}
          <span className="sbs-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
      )}
      <audio ref={audioRef} src={src || undefined} hidden />
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Authoring panel — only rendered when <SampleBreakdown authoring />. Lets
// you drop markers at the current cue position while listening, edit their
// labels, and copy out the loop + markers + current zoom window as JSON
// shaped to drop straight into techniques-data.js, instead of eyeballing
// timestamps by ear and hand-typing numbers.
// ---------------------------------------------------------------------------
function AuthoringPanel({ markers, onAddMarker, onUpdateMarker, onDeleteMarker, exportJson }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard permissions can fail quietly in some contexts — the JSON
      // is still visible below to select and copy by hand.
    }
  };

  return (
    <div className="sbs-authoring">
      <div className="sbs-authoring-head">
        <span className="sbs-eyebrow">Authoring</span>
        <button className="sbs-btn sbs-btn-icon" onClick={onAddMarker} title="Add marker at current playhead">
          <MapPin size={14} />
          + Marker
        </button>
      </div>

      {markers.length > 0 && (
        <ul className="sbs-marker-list">
          {markers.map((m) => (
            <li key={m.id}>
              <span className="sbs-marker-time">{formatTime(m.time)}</span>
              <input
                type="text"
                placeholder="label"
                value={m.label}
                onChange={(e) => onUpdateMarker(m.id, e.target.value)}
              />
              <button
                type="button"
                className="sbs-btn sbs-btn-icon"
                onClick={() => onDeleteMarker(m.id)}
                title="Remove marker"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="sbs-authoring-export">
        <button className="sbs-btn sbs-btn-primary" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy loop + markers JSON"}
        </button>
        <pre className="sbs-authoring-json">{exportJson}</pre>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Marker pad panel — the public-facing counterpart to AuthoringPanel. No
// labels, no export: just a row of pads mirroring the waveform pins. Click
// a pad to jump there (breaking any active loop, DJ hot-cue style), the
// small x deletes it, + drops a new one at the current playhead.
// ---------------------------------------------------------------------------
function MarkerPadPanel({ markers, onAddMarker, onPlayMarker, onDeleteMarker }) {
  return (
    <div className="sbs-pads">
      <span className="sbs-eyebrow">Pads</span>
      <div className="sbs-pads-grid">
        {markers.map((m, i) => (
          <div className="sbs-pad-wrap" key={m.id}>
            <button
              type="button"
              className="sbs-pad"
              onClick={() => onPlayMarker(m.time)}
              title={`Key ${i + 1} — ${formatTime(m.time)}`}
            >
              {i + 1}
            </button>
            <button
              type="button"
              className="sbs-pad-delete"
              onClick={() => onDeleteMarker(m.id)}
              title="Remove pad"
              aria-label="Remove pad"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="sbs-pad sbs-pad-add"
          onClick={onAddMarker}
          title="Add a pad at the current position"
          aria-label="Add pad"
        >
          <Plus size={16} />
        </button>
      </div>
      <span className="sbs-pads-hint">Press 1–9 to trigger a pad, or drop a new one at the next open number.</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
const SampleBreakdown = forwardRef(function SampleBreakdown(
  {
    id,
    inFile,
    outFile,
    inTitle,
    outTitle,
    inLabel = "Sample source",
    outLabel = "Used in",
    loop: loopProp,
    markers: markersProp = [],
    timeMarkers = [],
    initialZoom,
    authoring = false,
    pads = false,
    single = false,
    className = "",
  },
  externalRef
) {
  const [duration, setDuration] = useState(0);
  const [peaks, setPeaks] = useState(null);
  const [inSrc, setInSrc] = useState(inFile || null);
  const [outSrc, setOutSrc] = useState(outFile || null);
  const [inName, setInName] = useState(inTitle || null);
  const [outName, setOutName] = useState(outTitle || null);

  const [loop, setLoop] = useState({
    start: loopProp?.start ?? null,
    end: loopProp?.end ?? null,
    enabled: loopProp?.enabled ?? false,
  });
  const [markerList, setMarkerList] = useState(markersProp);

  const [view, setView] = useState({ start: 0, end: 1 });
  const [dragging, setDragging] = useState(null);
  const dragMeta = useRef({ startX: 0, startView: { start: 0, end: 1 }, moved: false });
  const initialZoomApplied = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const [trackPlaying, setTrackPlaying] = useState(false);
  const [trackDuration, setTrackDuration] = useState(0);
  const [trackCurrentTime, setTrackCurrentTime] = useState(0);

  const waveRef = useRef(null);
  const audioRef = useRef(null);
  const trackAudioRef = useRef(null);
  const inUrlRef = useRef(null);
  const outUrlRef = useRef(null);

  const loadFromUrl = useCallback(async (url) => {
    const res = await fetch(url);
    const arrayBuf = await res.arrayBuffer();
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const decoded = await ctx.decodeAudioData(arrayBuf);
    setDuration(decoded.duration);
    const n = Math.min(3000, Math.max(200, Math.floor(decoded.duration * 12)));
    setPeaks(extractPeaks(decoded, n));
  }, []);

  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (!inFile) return;
    setInSrc(inFile);
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
    } else {
      // Switching to a genuinely different track after mount (the
      // playground preset picker does this) — clear stale loop/marker
      // positions from the previous track rather than showing them
      // against a new waveform. On the very first load, skip this so
      // any loop/markers passed in via props still seed correctly.
      setLoop({ start: null, end: null, enabled: false });
      setMarkerList([]);
      setView({ start: 0, end: 1 });
      setDuration(0);
      setPeaks(null);
      initialZoomApplied.current = false;
    }
    loadFromUrl(inFile);
  }, [inFile, loadFromUrl]);

  useEffect(() => { if (outFile) setOutSrc(outFile); }, [outFile]);

  useEffect(() => {
    if (duration && loop.start == null) {
      setLoop((l) => ({ ...l, start: duration * 0.3, end: duration * 0.5 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  // Preset zoom, applied once per load. If `initialZoom={{ start, end }}`
  // (in seconds) is given, use it exactly. Otherwise, once the loop region
  // is known, default to framing the loop with some breathing room instead
  // of always opening on the full, zoomed-out waveform.
  useEffect(() => {
    if (!duration || initialZoomApplied.current) return;
    if (initialZoom) {
      initialZoomApplied.current = true;
      const start = Math.max(0, Math.min(1, initialZoom.start / duration));
      const end = Math.max(start + 0.01, Math.min(1, initialZoom.end / duration));
      setView({ start, end });
    } else if (loop.start != null && loop.end != null) {
      initialZoomApplied.current = true;
      const span = loop.end - loop.start;
      const pad = Math.max(span * 0.5, 2);
      const start = Math.max(0, (loop.start - pad) / duration);
      const end = Math.min(1, (loop.end + pad) / duration);
      setView({ start, end });
    }
  }, [duration, loop.start, loop.end, initialZoom]);

  const handleUploadIn = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInName(file.name);
    const arrayBuf = await file.arrayBuffer();
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const decoded = await ctx.decodeAudioData(arrayBuf);
    setDuration(decoded.duration);
    const n = Math.min(3000, Math.max(200, Math.floor(decoded.duration * 12)));
    setPeaks(extractPeaks(decoded, n));
    if (inUrlRef.current) URL.revokeObjectURL(inUrlRef.current);
    const url = URL.createObjectURL(file);
    inUrlRef.current = url;
    setInSrc(url);
  };

  const handleUploadOut = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOutName(file.name);
    if (outUrlRef.current) URL.revokeObjectURL(outUrlRef.current);
    const url = URL.createObjectURL(file);
    outUrlRef.current = url;
    setOutSrc(url);
  };

  // --- source transport ---------------------------------------------------
  const seekAndPlay = useCallback((t) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    el.currentTime = Math.max(0, Math.min(duration, t));
    el.play();
  }, [duration]);

  const playLoop = useCallback(() => {
    if (loop.start == null) return;
    setLoop((l) => ({ ...l, enabled: true }));
    seekAndPlay(loop.start);
  }, [loop.start, seekAndPlay]);

  // Jumping to a specific point (a marker, an external trigger) is a
  // deliberate "take me here instead" action — DJ hardware calls this
  // breaking out of a loop via a hot cue. So this always disarms an
  // active loop rather than letting you jump forward only to get pulled
  // back into the old loop region a few seconds later.
  const playFrom = useCallback((t) => {
    setLoop((l) => (l.enabled ? { ...l, enabled: false } : l));
    seekAndPlay(t);
  }, [seekAndPlay]);

  const playMarker = useCallback((markerId) => {
    const m = markerList.find((mm) => mm.id === markerId);
    if (!m) return;
    playFrom(m.time);
  }, [markerList, playFrom]);

  // --- authoring-only marker editing --------------------------------------
  const addMarkerAtCue = useCallback(() => {
    const t = audioRef.current?.currentTime ?? 0;
    setMarkerList((list) => [...list, { id: `m-${Date.now()}`, time: t, label: "" }]);
  }, []);

  const updateMarkerLabel = useCallback((markerId, label) => {
    setMarkerList((list) => list.map((m) => (m.id === markerId ? { ...m, label } : m)));
  }, []);

  const deleteMarker = useCallback((markerId) => {
    setMarkerList((list) => list.filter((m) => m.id !== markerId));
  }, []);

  // Number keys 1–9: press an occupied slot to trigger it (same as
  // clicking the pad — breaks an active loop, DJ hot-cue style), or press
  // the next open slot to drop a new pad at wherever you're currently
  // sitting in the track. Only active in pads/authoring modes, and
  // ignored while typing in a text field so it doesn't hijack the
  // authoring panel's label inputs.
  useEffect(() => {
    if (!pads && !authoring) return;
    const onKeyDown = (e) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const digit = Number(e.key);
      if (!Number.isInteger(digit) || digit < 1 || digit > 9) return;

      const index = digit - 1;
      const existing = markerList[index];
      if (existing) {
        playFrom(existing.time);
      } else if (index === markerList.length) {
        addMarkerAtCue();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pads, authoring, markerList, playFrom, addMarkerAtCue]);

  const pause = useCallback(() => audioRef.current?.pause(), []);

  // These no longer reach across to the other side at all — that's now
  // handled once, centrally, by the native "play" listeners below, which
  // fire regardless of which button/action actually started playback.
  const togglePlayPause = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else if (loop.enabled && loop.start != null && el.currentTime < 0.05) {
      // Starting fresh (at/near 0:00) with a loop armed — jump straight
      // into the loop rather than making them sit through the dead space
      // before it. Only fires from the true start: if they've paused mid-
      // loop, or scrubbed somewhere else, this leaves them right where
      // they are instead of yanking them back into the loop every time.
      seekAndPlay(loop.start);
    } else {
      el.play();
    }
  };

  const toggleTrackPlay = () => {
    const el = trackAudioRef.current;
    if (!el) return;
    if (trackPlaying) el.pause();
    else el.play();
  };

  useImperativeHandle(externalRef, () => ({ playLoop, playMarker, playFrom, pause }), [playLoop, playMarker, playFrom, pause]);

  useEffect(() => {
    if (!id) return;
    registry.set(id, { playLoop, playMarker, playFrom, pause });
    return () => registry.delete(id);
  }, [id, playLoop, playMarker, playFrom, pause]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => {
      // Pause the other side directly on its DOM ref — not via React state,
      // which is what was going stale here. pause() on an already-paused
      // element is a harmless no-op, so no need to check "is it playing?"
      // first, and this fires no matter what started this side's playback
      // (button, cue, marker, waveform click-to-seek, external trigger...).
      trackAudioRef.current?.pause();
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);
    const onTime = () => {
      setCurrentTime(el.currentTime);
      if (loop.enabled && loop.end != null && el.currentTime >= loop.end) {
        el.currentTime = loop.start;
      }
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTime);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
    };
  }, [loop.enabled, loop.start, loop.end]);

  const restartTrack = () => {
    const el = trackAudioRef.current;
    if (!el) return;
    el.currentTime = 0;
    setTrackCurrentTime(0);
  };

  useEffect(() => {
    const el = trackAudioRef.current;
    if (!el) return;
    const onPlay = () => {
      audioRef.current?.pause();
      setTrackPlaying(true);
    };
    const onPause = () => setTrackPlaying(false);
    const onMeta = () => setTrackDuration(el.duration || 0);
    const onTime = () => setTrackCurrentTime(el.currentTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("timeupdate", onTime);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("timeupdate", onTime);
    };
  }, [outSrc]);

  const armProgress = trackDuration ? Math.min(1, trackCurrentTime / trackDuration) : 0;
  const armAngle = TONEARM_OUTER_ANGLE + armProgress * (TONEARM_INNER_ANGLE - TONEARM_OUTER_ANGLE);

  const timeToFrac = useCallback((t) => (duration ? t / duration : 0), [duration]);
  const fracToTime = useCallback((f) => f * duration, [duration]);

  const screenPct = useCallback((t) => {
    if (t == null || !duration) return null;
    const f = timeToFrac(t);
    const span = view.end - view.start;
    if (f < view.start || f > view.end) return null;
    return ((f - view.start) / span) * 100;
  }, [duration, view, timeToFrac]);

  const fracFromClientX = (clientX) => {
    const rect = waveRef.current.getBoundingClientRect();
    const localFrac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return view.start + localFrac * (view.end - view.start);
  };

  const handleWheel = (e) => {
    if (!duration) return;
    e.preventDefault();
    const rect = waveRef.current.getBoundingClientRect();
    const cursorFrac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const anchorAbs = view.start + cursorFrac * (view.end - view.start);
    const span = view.end - view.start;
    const factor = e.deltaY < 0 ? 0.8 : 1.25;
    const minSpan = Math.min(0.02, 8 / Math.max(duration, 1));
    let newSpan = Math.min(1, Math.max(minSpan, span * factor));
    let newStart = anchorAbs - cursorFrac * newSpan;
    newStart = Math.min(1 - newSpan, Math.max(0, newStart));
    setView({ start: newStart, end: newStart + newSpan });
  };

  const onBgPointerDown = (e) => {
    dragMeta.current = { startX: e.clientX, startView: view, moved: false };
    setDragging("pan");
  };

  const onHandlePointerDown = (which) => (e) => {
    e.stopPropagation();
    setDragging(which);
  };

  const onPointerMove = useCallback((e) => {
    if (!dragging || !duration) return;
    if (dragging === "pan") {
      const rect = waveRef.current.getBoundingClientRect();
      const span = dragMeta.current.startView.end - dragMeta.current.startView.start;
      const deltaFrac = ((e.clientX - dragMeta.current.startX) / rect.width) * span;
      if (Math.abs(e.clientX - dragMeta.current.startX) > 3) dragMeta.current.moved = true;
      let newStart = dragMeta.current.startView.start - deltaFrac;
      newStart = Math.min(1 - span, Math.max(0, newStart));
      setView({ start: newStart, end: newStart + span });
    } else {
      const t = fracToTime(fracFromClientX(e.clientX));
      setLoop((l) => {
        if (dragging === "start") return { ...l, start: Math.min(t, (l.end ?? duration) - 0.05) };
        return { ...l, end: Math.max(t, (l.start ?? 0) + 0.05) };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, duration]);

  useEffect(() => {
    if (!dragging) return;
    const up = (e) => {
      if (dragging === "pan" && !dragMeta.current.moved) {
        seekAndPlay(fracToTime(fracFromClientX(e.clientX)));
      }
      setDragging(null);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, onPointerMove]);

  const resetZoom = () => setView({ start: 0, end: 1 });

  const overviewPeaks = useMemo(() => (peaks ? downsample(peaks, 220) : null), [peaks]);
  const visiblePeaks = useMemo(() => {
    if (!peaks) return null;
    const startIdx = Math.floor(view.start * peaks.length);
    const endIdx = Math.ceil(view.end * peaks.length);
    return downsample(peaks.slice(startIdx, endIdx), 400);
  }, [peaks, view]);

  const zoomed = view.end - view.start < 0.999;
  const playheadPct = screenPct(currentTime);

  const regionRect = useMemo(() => {
    if (loop.start == null || loop.end == null || !duration) return null;
    const viewStartT = fracToTime(view.start);
    const viewEndT = fracToTime(view.end);
    const overlapStart = Math.max(loop.start, viewStartT);
    const overlapEnd = Math.min(loop.end, viewEndT);
    if (overlapEnd <= overlapStart) return null;
    const leftFrac = (timeToFrac(overlapStart) - view.start) / (view.end - view.start);
    const rightFrac = (timeToFrac(overlapEnd) - view.start) / (view.end - view.start);
    return { left: leftFrac * 100, width: (rightFrac - leftFrac) * 100 };
  }, [loop.start, loop.end, view, duration, fracToTime, timeToFrac]);

  const loopStartPct = screenPct(loop.start);
  const loopEndPct = screenPct(loop.end);

  const round2 = (n) => (n == null ? n : Math.round(n * 100) / 100);
  const exportJson = useMemo(() => JSON.stringify({
    loop: { start: round2(loop.start), end: round2(loop.end), enabled: loop.enabled },
    markers: markerList.map(({ id, time, label }) => ({ id, time: round2(time), label })),
    initialZoom: { start: round2(fracToTime(view.start)), end: round2(fracToTime(view.end)) },
  }, null, 2), [loop, markerList, view, fracToTime]);

  return (
    <div className={`sbs-card ${single ? "sbs-card-single" : ""} ${className}`}>
      <Grid single={single}>
        <SamplePanel
          label={inLabel}
          name={inName}
          src={inSrc}
          onUpload={handleUploadIn}
          audioRef={audioRef}
          waveRef={waveRef}
          onWheel={handleWheel}
          onBgPointerDown={onBgPointerDown}
          visiblePeaks={visiblePeaks}
          overviewPeaks={overviewPeaks}
          fracToTime={fracToTime}
          timeToFrac={timeToFrac}
          screenPct={screenPct}
          view={view}
          setView={setView}
          loop={loop}
          setLoop={setLoop}
          regionRect={regionRect}
          playing={playing}
          playheadPct={playheadPct}
          loopStartPct={loopStartPct}
          loopEndPct={loopEndPct}
          onHandlePointerDown={onHandlePointerDown}
          markers={markerList}
          onPlayMarker={playFrom}
          onCue={playLoop}
          onTogglePlay={togglePlayPause}
          onResetZoom={resetZoom}
          zoomed={zoomed}
        />

        {!single && (
          <>
            <Connector />
            <RecordPanel
              label={outLabel}
              name={outName}
              src={outSrc}
              onUpload={handleUploadOut}
              audioRef={trackAudioRef}
              trackPlaying={trackPlaying}
              onTogglePlay={toggleTrackPlay}
              onRestart={restartTrack}
              armAngle={armAngle}
              currentTime={trackCurrentTime}
              duration={trackDuration}
              timeMarkers={timeMarkers}
            />
          </>
        )}
      </Grid>

      {pads && (
        <MarkerPadPanel
          markers={markerList}
          onAddMarker={addMarkerAtCue}
          onPlayMarker={playFrom}
          onDeleteMarker={deleteMarker}
        />
      )}

      {authoring && (
        <AuthoringPanel
          markers={markerList}
          onAddMarker={addMarkerAtCue}
          onUpdateMarker={updateMarkerLabel}
          onDeleteMarker={deleteMarker}
          exportJson={exportJson}
        />
      )}
    </div>
  );
});

export default SampleBreakdown;