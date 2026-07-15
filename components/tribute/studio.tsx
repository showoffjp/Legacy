"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Container, Field, inputCls, formatLongDate } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import { HYMNS } from "@/lib/data/hymns";
import { scriptureById } from "@/lib/data/scriptures";
import {
  drawFrame,
  pickRecorderMimeType,
  scheduleHymn,
  scheduleUploadedSong,
  timelineDuration,
  type Slide,
  type TributeSettings,
} from "@/components/tribute/engine";

const WIDTH = 1280;
const HEIGHT = 720;

interface StudioPhoto {
  id: string;
  url: string;
  image: HTMLImageElement;
  caption: string;
}

type MusicChoice = { kind: "hymn"; hymnId: string } | { kind: "upload" } | { kind: "silence" };

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `p-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = url;
  });
}

const PLAYABLE_HYMNS = HYMNS.filter((h) => h.melody && h.melody.length > 0);

export function TributeStudio() {
  const { plan, ready } = usePlan();

  const [photos, setPhotos] = useState<StudioPhoto[]>([]);
  const [dedication, setDedication] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectDates, setSubjectDates] = useState("");
  const [closingVerseText, setClosingVerseText] = useState(
    "I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live.",
  );
  const [closingVerseRef, setClosingVerseRef] = useState("John 11:25");
  const [secondsPerPhoto, setSecondsPerPhoto] = useState(5);
  const [music, setMusic] = useState<MusicChoice>({
    kind: "hymn",
    hymnId: PLAYABLE_HYMNS[0]?.id ?? "",
  });
  const [songBuffer, setSongBuffer] = useState<AudioBuffer | null>(null);
  const [songName, setSongName] = useState("");
  const [songError, setSongError] = useState("");

  const [mode, setMode] = useState<"idle" | "previewing" | "recording">("idle");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoExt, setVideoExt] = useState("webm");
  const [prefilled, setPrefilled] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const stopFlagRef = useRef(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const songInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill from the family's plan: name, dates, portrait, favorite verse, chosen hymn.
  useEffect(() => {
    if (!ready || prefilled) return;
    setPrefilled(true);
    const d = plan.deceased;
    if (d.fullName) setSubjectName(d.fullName);
    const dates = [d.birthDate, d.deathDate].filter(Boolean).map(formatLongDate).join(" — ");
    if (dates) setSubjectDates(dates);
    const fav = scriptureById(d.favoriteVerseId);
    if (fav) {
      setClosingVerseText(fav.text.length > 180 ? `${fav.text.slice(0, 177)}…` : fav.text);
      setClosingVerseRef(fav.reference);
    }
    const plannedPlayable = plan.hymnIds.find((id) => PLAYABLE_HYMNS.some((h) => h.id === id));
    if (plannedPlayable) setMusic({ kind: "hymn", hymnId: plannedPlayable });
    if (d.portraitDataUrl) {
      loadImage(d.portraitDataUrl)
        .then((image) =>
          setPhotos((prev) =>
            prev.length === 0
              ? [{ id: newId(), url: d.portraitDataUrl, image, caption: "" }]
              : prev,
          ),
        )
        .catch(() => {});
    }
  }, [ready, prefilled, plan]);

  const settings: TributeSettings = useMemo(() => {
    const slides: Slide[] = [
      {
        kind: "title",
        eyebrow: "In Loving Memory",
        title: subjectName || "A Life Well Lived",
        subtitle: subjectDates,
        footer: dedication,
      },
      ...photos.map<Slide>((p) => ({ kind: "photo", image: p.image, caption: p.caption })),
      {
        kind: "title",
        eyebrow: "Until we meet again",
        title: "“" + closingVerseText + "”",
        subtitle: closingVerseRef,
        footer: "Forever in our hearts",
      },
    ];
    return {
      slides,
      secondsPerPhoto: Math.max(3, Math.min(10, secondsPerPhoto)),
      crossfadeSeconds: 1.1,
      width: WIDTH,
      height: HEIGHT,
    };
  }, [photos, subjectName, subjectDates, dedication, closingVerseText, closingVerseRef, secondsPerPhoto]);

  const totalSeconds = timelineDuration(settings);

  const stopPlayback = useCallback(() => {
    stopFlagRef.current = true;
    cancelAnimationFrame(rafRef.current);
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    recorderRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setMode("idle");
    setProgress(0);
  }, []);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  // Draw a poster frame whenever settings change while idle.
  useEffect(() => {
    if (mode !== "idle") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) drawFrame(ctx, 0.6, settings);
    });
    return () => {
      cancelled = true;
    };
  }, [settings, mode]);

  async function addPhotos(files: FileList | null) {
    if (!files) return;
    const additions: StudioPhoto[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const url = URL.createObjectURL(file);
      try {
        const image = await loadImage(url);
        additions.push({ id: newId(), url, image, caption: "" });
      } catch {
        URL.revokeObjectURL(url);
      }
    }
    setPhotos((prev) => [...prev, ...additions]);
  }

  function movePhoto(index: number, delta: number) {
    setPhotos((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const gone = prev.find((p) => p.id === id);
      if (gone && gone.url.startsWith("blob:")) URL.revokeObjectURL(gone.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  async function onSongFile(file: File | undefined) {
    if (!file) return;
    setSongError("");
    try {
      const arrayBuf = await file.arrayBuffer();
      const probeCtx = new AudioContext();
      const decoded = await probeCtx.decodeAudioData(arrayBuf);
      await probeCtx.close();
      setSongBuffer(decoded);
      setSongName(file.name);
      setMusic({ kind: "upload" });
    } catch {
      setSongError("That file could not be read as audio — MP3, WAV, and M4A work best.");
    }
  }

  /** Run the timeline onto the canvas; optionally record it. */
  async function run(record: boolean) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (photos.length === 0) return;

    stopFlagRef.current = false;
    setVideoUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return "";
    });
    setMode(record ? "recording" : "previewing");

    await document.fonts.ready;

    // — Audio graph —
    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;
    const recordDest = record ? audioCtx.createMediaStreamDestination() : null;
    const outs: AudioNode[] = [audioCtx.destination];
    if (recordDest) outs.push(recordDest);

    if (music.kind === "hymn") {
      const hymn = PLAYABLE_HYMNS.find((h) => h.id === music.hymnId) ?? PLAYABLE_HYMNS[0];
      if (hymn?.melody) scheduleHymn(audioCtx, outs, hymn.melody, audioCtx.currentTime, totalSeconds);
    } else if (music.kind === "upload" && songBuffer) {
      scheduleUploadedSong(audioCtx, outs, songBuffer, audioCtx.currentTime, totalSeconds);
    }

    // — Recorder —
    let recorder: MediaRecorder | null = null;
    const chunks: BlobPart[] = [];
    if (record) {
      const stream = canvas.captureStream(30);
      recordDest?.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
      const mimeType = pickRecorderMimeType();
      recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        const type = recorder?.mimeType || "video/webm";
        const blob = new Blob(chunks, { type });
        setVideoExt(type.includes("mp4") ? "mp4" : "webm");
        setVideoUrl(URL.createObjectURL(blob));
      };
      recorder.start(500);
      recorderRef.current = recorder;
    }

    const startedAt = performance.now();
    const tick = (now: number) => {
      if (stopFlagRef.current) return;
      const t = (now - startedAt) / 1000;
      if (t >= totalSeconds) {
        drawFrame(ctx, totalSeconds - 0.001, settings);
        if (recorder && recorder.state !== "inactive") recorder.stop();
        recorderRef.current = null;
        audioCtx.close().catch(() => {});
        audioCtxRef.current = null;
        setMode("idle");
        setProgress(0);
        return;
      }
      drawFrame(ctx, t, settings);
      setProgress(t / totalSeconds);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  const busy = mode !== "idle";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);

  return (
    <div className="bg-parchment">
      <section className="border-b border-line bg-night text-parchment">
        <Container className="py-12 text-center">
          <span className="ornament justify-center text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold-pale">
            The tribute studio
          </span>
          <h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">
            Their life, in light and song
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-parchment/70">
            Gather their photographs, choose a hymn or their own favorite song, and we will weave a
            gentle tribute film for the service. Everything is created privately on this device —
            nothing is uploaded anywhere.
          </p>
        </Container>
      </section>

      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Preview column */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-line bg-night shadow-lift">
              <canvas
                ref={canvasRef}
                width={WIDTH}
                height={HEIGHT}
                className="block aspect-video w-full"
                aria-label="Tribute video preview"
              />
              {busy ? (
                <div className="px-4 pb-4">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full bg-gold transition-[width] duration-200"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-parchment/70">
                    {mode === "recording"
                      ? "Recording the tribute — please keep this tab in the foreground…"
                      : "Previewing…"}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {!busy ? (
                <>
                  <button
                    type="button"
                    onClick={() => run(false)}
                    disabled={photos.length === 0}
                    className="rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold-deep disabled:opacity-50"
                  >
                    ▶ Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => run(true)}
                    disabled={photos.length === 0}
                    className="rounded-full bg-gold px-7 py-3 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-deep disabled:opacity-50"
                  >
                    🎞 Create the video
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={stopPlayback}
                  className="rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-ink hover:border-gold"
                >
                  ■ Stop
                </button>
              )}
              <span className="text-sm text-ink-faint">
                {photos.length} photograph{photos.length === 1 ? "" : "s"} · about {minutes}:
                {String(seconds).padStart(2, "0")}
              </span>
            </div>

            {photos.length === 0 ? (
              <p className="mt-4 rounded-xl bg-gold-pale/40 px-4 py-3 text-sm text-ink-soft">
                Add photographs on the right to begin — the film opens with their name, moves
                gently through every picture, and closes with a verse.
              </p>
            ) : null}

            {videoUrl ? (
              <div className="mt-8 rounded-2xl border border-line bg-white/80 p-6 shadow-soft">
                <h2 className="font-display text-2xl font-semibold text-ink">
                  The tribute is ready
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Play it below, then download it for the service. Your funeral home or church can
                  play it during visitation or before the message.
                </p>
                <video src={videoUrl} controls className="mt-4 w-full rounded-xl" />
                <a
                  href={videoUrl}
                  download={`tribute-${(subjectName || "in-loving-memory")
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")}.${videoExt}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-parchment transition-colors hover:bg-night"
                >
                  ⬇ Download the tribute video
                </a>
              </div>
            ) : null}
          </div>

          {/* Controls column */}
          <div className="space-y-8">
            <section className="rounded-2xl border border-line bg-white/80 p-6 shadow-soft">
              <h2 className="font-display text-xl font-semibold text-ink">Photographs</h2>
              <p className="mt-1 text-xs text-ink-faint">
                Ten to thirty photographs make a lovely film. They appear in the order below.
              </p>
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="mt-4 w-full rounded-xl border border-dashed border-line bg-parchment px-4 py-6 text-sm font-medium text-ink-soft transition-colors hover:border-gold hover:text-gold-deep"
              >
                + Add photographs
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                aria-label="Add photographs"
                onChange={(e) => {
                  addPhotos(e.target.files);
                  e.target.value = "";
                }}
              />
              <ul className="mt-4 space-y-3">
                {photos.map((p, i) => (
                  <li key={p.id} className="flex gap-3 rounded-xl border border-line bg-white p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url}
                      alt={`Photograph ${i + 1}`}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <input
                        className="w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none"
                        placeholder="Caption (optional) — e.g. 'Wedding day, 1961'"
                        aria-label={`Caption for photograph ${i + 1}`}
                        value={p.caption}
                        onChange={(e) =>
                          setPhotos((prev) =>
                            prev.map((x) => (x.id === p.id ? { ...x, caption: e.target.value } : x)),
                          )
                        }
                      />
                      <div className="mt-1.5 flex gap-1 text-xs">
                        <button
                          type="button"
                          onClick={() => movePhoto(i, -1)}
                          disabled={i === 0}
                          aria-label={`Move photograph ${i + 1} earlier`}
                          className="rounded px-2 py-1 text-ink-soft hover:bg-parchment disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => movePhoto(i, 1)}
                          disabled={i === photos.length - 1}
                          aria-label={`Move photograph ${i + 1} later`}
                          className="rounded px-2 py-1 text-ink-soft hover:bg-parchment disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removePhoto(p.id)}
                          aria-label={`Remove photograph ${i + 1}`}
                          className="ml-auto rounded px-2 py-1 text-ink-faint hover:bg-parchment hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-line bg-white/80 p-6 shadow-soft">
              <h2 className="font-display text-xl font-semibold text-ink">Music</h2>
              <div className="mt-4 space-y-3">
                <label className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="music"
                    checked={music.kind === "hymn"}
                    onChange={() =>
                      setMusic({ kind: "hymn", hymnId: PLAYABLE_HYMNS[0]?.id ?? "" })
                    }
                    className="mt-1 accent-gold"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-ink">A gentle hymn</span>
                    <span className="block text-xs text-ink-faint">
                      Played as a soft instrumental, woven through the whole film.
                    </span>
                    {music.kind === "hymn" ? (
                      <select
                        className={`${inputCls} mt-2`}
                        value={music.hymnId}
                        aria-label="Choose a hymn"
                        onChange={(e) => setMusic({ kind: "hymn", hymnId: e.target.value })}
                      >
                        {PLAYABLE_HYMNS.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.title}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </span>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="music"
                    checked={music.kind === "upload"}
                    onChange={() => {
                      setMusic({ kind: "upload" });
                      if (!songBuffer) songInputRef.current?.click();
                    }}
                    className="mt-1 accent-gold"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-ink">
                      Their favorite song
                    </span>
                    <span className="block text-xs text-ink-faint">
                      Upload an MP3 or other audio file from your device.
                    </span>
                    {music.kind === "upload" ? (
                      <span className="mt-2 block">
                        <button
                          type="button"
                          onClick={() => songInputRef.current?.click()}
                          className="rounded-full border border-line bg-white px-4 py-2 text-xs font-medium text-ink hover:border-gold"
                        >
                          {songName ? `♪ ${songName} — change` : "Choose an audio file"}
                        </button>
                        {songError ? (
                          <span className="mt-1 block text-xs text-red-700">{songError}</span>
                        ) : null}
                      </span>
                    ) : null}
                  </span>
                </label>
                <input
                  ref={songInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  aria-label="Upload their favorite song"
                  onChange={(e) => onSongFile(e.target.files?.[0])}
                />

                <label className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="music"
                    checked={music.kind === "silence"}
                    onChange={() => setMusic({ kind: "silence" })}
                    className="mt-1 accent-gold"
                  />
                  <span>
                    <span className="block text-sm font-medium text-ink">Silence</span>
                    <span className="block text-xs text-ink-faint">
                      For services where music will be played live.
                    </span>
                  </span>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-white/80 p-6 shadow-soft">
              <h2 className="font-display text-xl font-semibold text-ink">Words</h2>
              <div className="mt-4 space-y-4">
                <Field label="Their name" hint="Shown on the opening title.">
                  <input
                    className={inputCls}
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="Eleanor Mae Thompson"
                  />
                </Field>
                <Field label="Dates" hint="e.g. April 12, 1938 — May 30, 2026">
                  <input
                    className={inputCls}
                    value={subjectDates}
                    onChange={(e) => setSubjectDates(e.target.value)}
                  />
                </Field>
                <Field label="Dedication line" hint="Optional — shown beneath the opening title.">
                  <input
                    className={inputCls}
                    value={dedication}
                    onChange={(e) => setDedication(e.target.value)}
                    placeholder="Beloved wife, mother, and friend"
                  />
                </Field>
                <Field label="Closing verse">
                  <textarea
                    className={`${inputCls} min-h-20 resize-y`}
                    value={closingVerseText}
                    onChange={(e) => setClosingVerseText(e.target.value)}
                  />
                </Field>
                <Field label="Verse reference">
                  <input
                    className={inputCls}
                    value={closingVerseRef}
                    onChange={(e) => setClosingVerseRef(e.target.value)}
                  />
                </Field>
                <Field label={`Seconds per photograph — ${secondsPerPhoto}s`}>
                  <input
                    type="range"
                    min={3}
                    max={10}
                    step={1}
                    value={secondsPerPhoto}
                    onChange={(e) => setSecondsPerPhoto(Number(e.target.value))}
                    className="w-full accent-gold"
                  />
                </Field>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
