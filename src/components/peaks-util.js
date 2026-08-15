// ---------------------------------------------------------------------------
// Peak extraction — min/max per bucket. Resolution scales with track length.
// ---------------------------------------------------------------------------
export function extractPeaks(audioBuffer, numBuckets) {
  const channels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const samplesPerBucket = Math.max(1, Math.floor(length / numBuckets));
  const peaks = new Array(numBuckets);
  const channelData = [];
  for (let c = 0; c < channels; c++) channelData.push(audioBuffer.getChannelData(c));

  for (let i = 0; i < numBuckets; i++) {
    let min = 1.0;
    let max = -1.0;
    const start = i * samplesPerBucket;
    const end = Math.min(start + samplesPerBucket, length);
    for (let j = start; j < end; j++) {
      let sum = 0;
      for (let c = 0; c < channels; c++) sum += channelData[c][j];
      const v = sum / channels;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    peaks[i] = { min, max };
  }
  return peaks;
}
export function downsample(peaks, maxBars) {
  if (peaks.length <= maxBars) return peaks;
  const groupSize = Math.ceil(peaks.length / maxBars);
  const out = [];
  for (let i = 0; i < peaks.length; i += groupSize) {
    const group = peaks.slice(i, i + groupSize);
    let min = 1.0, max = -1.0;
    for (const p of group) { if (p.min < min) min = p.min; if (p.max > max) max = p.max; }
    out.push({ min, max });
  }
  return out;
}
export function formatTime(t) {
  if (t == null || !isFinite(t)) return "--:--";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
