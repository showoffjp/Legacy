/**
 * The tribute film engine — renders a slideshow with Ken Burns motion and
 * crossfades onto a canvas, weaves in gentle instrumental hymn audio (or the
 * family's own uploaded song), and records the result to a WebM video
 * entirely in the browser. Nothing is uploaded anywhere.
 */

export interface PhotoSlide {
  kind: "photo";
  image: HTMLImageElement;
  caption: string;
}

export interface TitleSlide {
  kind: "title";
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
}

export type Slide = PhotoSlide | TitleSlide;

export interface TributeSettings {
  slides: Slide[];
  secondsPerPhoto: number;
  crossfadeSeconds: number;
  width: number;
  height: number;
}

const TITLE_SECONDS = 5;

export function timelineDuration(s: TributeSettings): number {
  return s.slides.reduce(
    (sum, slide) => sum + (slide.kind === "title" ? TITLE_SECONDS : s.secondsPerPhoto),
    0,
  );
}

function slideDuration(slide: Slide, s: TributeSettings): number {
  return slide.kind === "title" ? TITLE_SECONDS : s.secondsPerPhoto;
}

/** Deterministic per-slide Ken Burns move (alternating, gentle). */
function kenBurns(index: number) {
  const zoomIn = index % 2 === 0;
  const drift = [
    { x: -0.02, y: -0.015 },
    { x: 0.02, y: -0.01 },
    { x: -0.015, y: 0.02 },
    { x: 0.02, y: 0.015 },
  ][index % 4];
  return {
    scaleFrom: zoomIn ? 1.02 : 1.14,
    scaleTo: zoomIn ? 1.14 : 1.02,
    drift,
  };
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  scale: number,
  driftX: number,
  driftY: number,
) {
  const imgRatio = img.width / img.height;
  const canvasRatio = w / h;
  let drawW: number, drawH: number;
  if (imgRatio > canvasRatio) {
    drawH = h * scale;
    drawW = drawH * imgRatio;
  } else {
    drawW = w * scale;
    drawH = drawW / imgRatio;
  }
  const x = (w - drawW) / 2 + driftX * w;
  const y = (h - drawH) / 2 + driftY * h;
  ctx.drawImage(img, x, y, drawW, drawH);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const attempt = line ? `${line} ${word}` : word;
    if (ctx.measureText(attempt).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = attempt;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawSlide(
  ctx: CanvasRenderingContext2D,
  slide: Slide,
  slideIndex: number,
  progress: number, // 0..1 within this slide
  s: TributeSettings,
) {
  const { width: w, height: h } = s;

  if (slide.kind === "photo") {
    const kb = kenBurns(slideIndex);
    const t = easeInOut(progress);
    const scale = kb.scaleFrom + (kb.scaleTo - kb.scaleFrom) * t;
    const driftX = kb.drift.x * (t - 0.5);
    const driftY = kb.drift.y * (t - 0.5);
    ctx.fillStyle = "#171d2b";
    ctx.fillRect(0, 0, w, h);
    drawCover(ctx, slide.image, w, h, scale, driftX, driftY);

    // Soft vignette keeps the frame reverent and helps captions read.
    const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.45, w / 2, h / 2, h * 0.95);
    vignette.addColorStop(0, "rgba(23,29,43,0)");
    vignette.addColorStop(1, "rgba(23,29,43,0.42)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    if (slide.caption) {
      const grad = ctx.createLinearGradient(0, h - h * 0.24, 0, h);
      grad.addColorStop(0, "rgba(23,29,43,0)");
      grad.addColorStop(1, "rgba(23,29,43,0.78)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, h - h * 0.24, w, h * 0.24);
      ctx.fillStyle = "rgba(250,247,241,0.96)";
      ctx.font = `italic 500 ${Math.round(h * 0.045)}px "Cormorant Garamond", Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(slide.caption, w / 2, h - h * 0.06, w * 0.86);
    }
    return;
  }

  // Title card — deep night background with a slow-breathing gold glow.
  ctx.fillStyle = "#171d2b";
  ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(w / 2, h * 0.42, 10, w / 2, h * 0.42, h * 0.8);
  const breathe = 0.32 + 0.08 * Math.sin(progress * Math.PI);
  glow.addColorStop(0, `rgba(163,131,63,${breathe})`);
  glow.addColorStop(1, "rgba(23,29,43,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  if (slide.eyebrow) {
    ctx.fillStyle = "rgba(236,223,194,0.85)";
    ctx.font = `600 ${Math.round(h * 0.032)}px Inter, system-ui, sans-serif`;
    const spaced = slide.eyebrow.toUpperCase().split("").join("  ");
    ctx.fillText(spaced, w / 2, h * 0.33, w * 0.9);
  }

  // Gold cross ornament
  ctx.strokeStyle = "rgba(163,131,63,0.9)";
  ctx.lineWidth = Math.max(2, h * 0.004);
  const cy = h * 0.4;
  ctx.beginPath();
  ctx.moveTo(w / 2 - w * 0.09, cy);
  ctx.lineTo(w / 2 - w * 0.025, cy);
  ctx.moveTo(w / 2 + w * 0.025, cy);
  ctx.lineTo(w / 2 + w * 0.09, cy);
  ctx.moveTo(w / 2, cy - h * 0.022);
  ctx.lineTo(w / 2, cy + h * 0.022);
  ctx.moveTo(w / 2 - w * 0.008, cy - h * 0.008);
  ctx.lineTo(w / 2 + w * 0.008, cy - h * 0.008);
  ctx.stroke();

  ctx.fillStyle = "rgba(250,247,241,0.98)";
  ctx.font = `500 ${Math.round(h * 0.085)}px "Cormorant Garamond", Georgia, serif`;
  const titleLines = wrapText(ctx, slide.title, w * 0.82);
  titleLines.forEach((line, i) => {
    ctx.fillText(line, w / 2, h * 0.52 + i * h * 0.095);
  });

  if (slide.subtitle) {
    ctx.fillStyle = "rgba(236,223,194,0.9)";
    ctx.font = `italic 400 ${Math.round(h * 0.042)}px "Cormorant Garamond", Georgia, serif`;
    const subLines = wrapText(ctx, slide.subtitle, w * 0.78);
    subLines.forEach((line, i) => {
      ctx.fillText(line, w / 2, h * 0.52 + titleLines.length * h * 0.095 + i * h * 0.055);
    });
  }

  if (slide.footer) {
    ctx.fillStyle = "rgba(250,247,241,0.55)";
    ctx.font = `500 ${Math.round(h * 0.028)}px Inter, system-ui, sans-serif`;
    ctx.fillText(slide.footer, w / 2, h * 0.9, w * 0.8);
  }
}

/** Draw the frame at absolute time t (seconds) with crossfades between slides. */
export function drawFrame(ctx: CanvasRenderingContext2D, t: number, s: TributeSettings) {
  const fade = s.crossfadeSeconds;
  let acc = 0;
  for (let i = 0; i < s.slides.length; i++) {
    const dur = slideDuration(s.slides[i], s);
    if (t < acc + dur || i === s.slides.length - 1) {
      const local = Math.min(t - acc, dur);
      drawSlide(ctx, s.slides[i], i, Math.max(0, Math.min(1, local / dur)), s);

      // Crossfade the next slide in over the tail of this one.
      const remaining = dur - local;
      if (remaining < fade && i + 1 < s.slides.length) {
        const alpha = 1 - remaining / fade;
        ctx.save();
        ctx.globalAlpha = easeInOut(Math.max(0, Math.min(1, alpha)));
        drawSlide(ctx, s.slides[i + 1], i + 1, 0, s);
        ctx.restore();
      }
      return;
    }
    acc += dur;
  }
}

/* ————————————————— Audio ————————————————— */

const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

/**
 * Schedule a gentle instrumental rendition of a hymn melody, looping to fill
 * `totalSeconds`, into the given destinations (speakers and/or recorder).
 */
export function scheduleHymn(
  ctx: AudioContext,
  outs: AudioNode[],
  melody: [number, number][],
  startAt: number,
  totalSeconds: number,
): void {
  const master = ctx.createGain();
  master.gain.value = 0.9;
  outs.forEach((o) => master.connect(o));

  // Fade the whole piece out over the final three seconds.
  master.gain.setValueAtTime(0.9, startAt + Math.max(0, totalSeconds - 3));
  master.gain.linearRampToValueAtTime(0.0001, startAt + totalSeconds);

  const beat = 0.62; // a slow, prayerful tempo
  let t = startAt + 0.15;
  const end = startAt + totalSeconds;
  let i = 0;
  const phraseGap = beat * 1.5;

  while (t < end) {
    const [midi, beats] = melody[i % melody.length];
    const dur = beats * beat;
    if (midi > 0) {
      const freq = midiToFreq(midi);

      // Lead voice — warm triangle with a soft envelope.
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.16, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.045, t + dur * 0.85);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.35);
      osc.connect(gain).connect(master);
      osc.start(t);
      osc.stop(t + dur + 0.4);

      // A quiet octave-below sine adds organ-like warmth.
      const sub = ctx.createOscillator();
      sub.type = "sine";
      sub.frequency.value = freq / 2;
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.0001, t);
      subGain.gain.exponentialRampToValueAtTime(0.05, t + 0.09);
      subGain.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.3);
      sub.connect(subGain).connect(master);
      sub.start(t);
      sub.stop(t + dur + 0.35);
    }
    t += dur;
    i += 1;
    if (i % melody.length === 0) t += phraseGap; // breathe between verses
  }
}

/** Play the family's own uploaded song, looped and faded, into the outputs. */
export function scheduleUploadedSong(
  ctx: AudioContext,
  outs: AudioNode[],
  buffer: AudioBuffer,
  startAt: number,
  totalSeconds: number,
): AudioBufferSourceNode {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = buffer.duration < totalSeconds;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.85, startAt + 1.2);
  gain.gain.setValueAtTime(0.85, startAt + Math.max(1.2, totalSeconds - 3));
  gain.gain.linearRampToValueAtTime(0.0001, startAt + totalSeconds);
  src.connect(gain);
  outs.forEach((o) => gain.connect(o));
  src.start(startAt);
  src.stop(startAt + totalSeconds + 0.1);
  return src;
}

export function pickRecorderMimeType(): string {
  const candidates = [
    'video/webm;codecs="vp9,opus"',
    'video/webm;codecs="vp8,opus"',
    "video/webm",
    "video/mp4",
  ];
  if (typeof MediaRecorder === "undefined") return "";
  return candidates.find((c) => MediaRecorder.isTypeSupported(c)) ?? "";
}
