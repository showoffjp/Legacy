"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, Container, Field, inputCls } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";
import { SCRIPTURES, scriptureById } from "@/lib/data/scriptures";

/**
 * Writing help, gently offered. A blank page is cruel in the week of a
 * loss — so the studio asks small, human questions and weaves the
 * answers into a first draft that is always the family's to edit.
 * Everything happens on this device; nothing is uploaded or generated
 * by a machine mind — the words are the family's own, arranged.
 */

const STORAGE_KEY = "legacy-eulogy-v1";

type PronounKey = "she" | "he" | "they";

interface PronounSet {
  subj: string;
  obj: string;
  possAdj: string;
  was: string;
}

const PRONOUNS: Record<PronounKey, PronounSet> = {
  she: { subj: "she", obj: "her", possAdj: "her", was: "was" },
  he: { subj: "he", obj: "him", possAdj: "his", was: "was" },
  they: { subj: "they", obj: "them", possAdj: "their", was: "were" },
};

const PROMPTS: { key: AnswerKey; question: string; hint: string; placeholder: string }[] = [
  {
    key: "relationship",
    question: "Who were they to you?",
    hint: "Not the résumé — the relationship. Finish the thought: “To me, they were…”",
    placeholder: "my grandmother — and my first Sunday school teacher",
  },
  {
    key: "essence",
    question: "If someone never met them, what should they know first?",
    hint: "The one true thing about them that everything else grew from.",
    placeholder: "She never once made anyone feel small.",
  },
  {
    key: "story",
    question: "Tell one story that captures them.",
    hint: "Small stories carry best from a pulpit — a kitchen, a porch, a long drive.",
    placeholder:
      "The summer the church flooded, she was seventy-eight years old and first through the door with a mop…",
  },
  {
    key: "faith",
    question: "How did they live their faith?",
    hint: "What they did, more than what they said.",
    placeholder: "Forty-two years of Sunday school, and a casserole on every grieving porch in town.",
  },
  {
    key: "teach",
    question: "What did they teach you — without ever calling it a lesson?",
    hint: "The thing you find yourself doing now, because they did it first.",
    placeholder: "That you show up. Every time. Especially when it's hard.",
  },
  {
    key: "joy",
    question: "What made them laugh? What did they love?",
    hint: "Let the room smile once — they will need it.",
    placeholder: "Hummingbirds, hymnals, and beating every grandchild at dominoes without mercy.",
  },
  {
    key: "miss",
    question: "What will you miss most?",
    hint: "It is alright if this one is hard to write.",
    placeholder: "Her voice on the phone on Sunday afternoons.",
  },
];

type AnswerKey =
  | "relationship"
  | "essence"
  | "story"
  | "faith"
  | "teach"
  | "joy"
  | "miss";

type Answers = Record<AnswerKey, string>;

const EMPTY_ANSWERS: Answers = {
  relationship: "",
  essence: "",
  story: "",
  faith: "",
  teach: "",
  joy: "",
  miss: "",
};

interface StoredEulogy {
  answers: Answers;
  pronoun: PronounKey;
  verseId: string;
  draft: string;
}

function cap(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Ensure an answer reads as a finished sentence when placed in the draft. */
function sentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return /[.!?…”"]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function composeDraft(input: {
  name: string;
  nickname: string;
  answers: Answers;
  pronoun: PronounKey;
  verseId: string;
}): string {
  const p = PRONOUNS[input.pronoun];
  const name = input.name.trim() || "our loved one";
  const firstName = input.nickname.trim() || name.split(/\s+/)[0];
  const a = input.answers;
  const verse = scriptureById(input.verseId);
  const paragraphs: string[] = [];

  paragraphs.push(
    `We are gathered to give thanks for the life of ${name}${
      input.nickname.trim() ? ` — “${input.nickname.trim()}” to those who loved ${p.obj} best` : ""
    }.${a.relationship.trim() ? ` To me, ${p.subj} ${p.was} ${sentence(a.relationship)}` : ""}`,
  );

  if (a.essence.trim()) {
    paragraphs.push(
      `If you never had the gift of knowing ${firstName}, let me tell you what mattered most: ${sentence(a.essence)}`,
    );
  }
  if (a.story.trim()) {
    paragraphs.push(`I keep returning to one memory. ${sentence(cap(a.story.trim()))}`);
  }
  if (a.faith.trim()) {
    paragraphs.push(
      `${cap(p.possAdj)} faith was not a subject ${p.subj} lectured on — it was something ${p.subj} lived. ${sentence(cap(a.faith.trim()))}`,
    );
  }
  if (a.teach.trim()) {
    paragraphs.push(
      `Without ever calling it a lesson, ${p.subj} taught me something I will carry always: ${sentence(a.teach)}`,
    );
  }
  if (a.joy.trim()) {
    paragraphs.push(`And ${p.subj} knew joy. ${sentence(cap(a.joy.trim()))}`);
  }
  if (a.miss.trim()) {
    paragraphs.push(`What will I miss? ${sentence(cap(a.miss.trim()))}`);
  }
  if (verse) {
    paragraphs.push(
      `Scripture holds us today, as ${p.subj} would want: “${verse.text}” — ${verse.reference}.`,
    );
  }
  paragraphs.push(
    `So we will not say goodbye. We will say what ${p.subj} taught us to say: thank you. Thank you, ${firstName}, for every ordinary day made holy by your love. “Well done, good and faithful servant… enter thou into the joy of thy lord.” Until we meet again.`,
  );

  return paragraphs.join("\n\n");
}

/** ~130 words a minute is a gentle pulpit pace. */
function speakingEstimate(draft: string): { words: number; label: string } {
  const words = draft.split(/\s+/).filter(Boolean).length;
  if (words === 0) return { words: 0, label: "" };
  const minutes = Math.max(1, Math.round(words / 130));
  return {
    words,
    label: `About ${minutes} minute${minutes === 1 ? "" : "s"} at a gentle pace (${words} words)`,
  };
}

export function EulogyStudio() {
  const { plan, ready } = usePlan();
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [pronoun, setPronoun] = useState<PronounKey>("they");
  const [verseId, setVerseId] = useState("");
  const [draft, setDraft] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Saved work returns after mount, so the server render stays stable.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as Partial<StoredEulogy>;
        setAnswers({ ...EMPTY_ANSWERS, ...stored.answers });
        if (stored.pronoun && stored.pronoun in PRONOUNS) setPronoun(stored.pronoun);
        if (typeof stored.verseId === "string") setVerseId(stored.verseId);
        if (typeof stored.draft === "string") setDraft(stored.draft);
      }
    } catch {
      // Begin fresh if the saved work cannot be read.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, pronoun, verseId, draft } satisfies StoredEulogy),
      );
    } catch {
      // Storage unavailable — the studio still works for this visit.
    }
  }, [answers, pronoun, verseId, draft, loaded]);

  const name = plan.deceased.fullName;
  const nickname = plan.deceased.nickname;
  const estimate = useMemo(() => speakingEstimate(draft), [draft]);
  const answered = PROMPTS.filter((prompt) => answers[prompt.key].trim()).length;
  const draftParagraphs = draft.split(/\n\s*\n/).map((para) => para.trim()).filter(Boolean);

  if (!ready) return <div className="min-h-screen bg-parchment-deep/40" />;

  return (
    <div className="bg-parchment-deep/40 pb-20">
      {/* Toolbar — never printed */}
      <div className="no-print border-b border-line bg-parchment">
        <Container className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              Writing the eulogy{name ? ` for ${name}` : ""}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Answer what you can — skip what you can&apos;t. The draft is woven from your own
              words, and it is always yours to change.{" "}
              <Link href="/plan" className="text-gold-deep underline-offset-2 hover:underline">
                Return to the planner
              </Link>
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={draftParagraphs.length === 0}
            className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            🖨 Print the pulpit copy
          </button>
        </Container>
      </div>

      <Container className="no-print py-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          {/* ——— The interview ——— */}
          <section aria-label="Interview">
            <h2 className="font-display text-xl font-semibold text-ink">
              Tell us about {nickname || name || "them"}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {answered} of {PROMPTS.length} answered — even two or three make a beautiful draft.
            </p>
            <div className="mt-5 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Speaking of them as">
                  <select
                    className={inputCls}
                    value={pronoun}
                    onChange={(e) => setPronoun(e.target.value as PronounKey)}
                  >
                    <option value="she">she / her</option>
                    <option value="he">he / him</option>
                    <option value="they">they / them</option>
                  </select>
                </Field>
                <Field label="A verse to hold the room" hint="Optional — woven in near the end.">
                  <select
                    className={inputCls}
                    value={verseId}
                    onChange={(e) => setVerseId(e.target.value)}
                  >
                    <option value="">No verse</option>
                    {SCRIPTURES.map((scripture) => (
                      <option key={scripture.id} value={scripture.id}>
                        {scripture.reference}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              {PROMPTS.map((prompt) => (
                <Field key={prompt.key} label={prompt.question} hint={prompt.hint}>
                  <textarea
                    className={`${inputCls} min-h-24 resize-y`}
                    value={answers[prompt.key]}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [prompt.key]: e.target.value }))
                    }
                    placeholder={prompt.placeholder}
                  />
                </Field>
              ))}
            </div>
          </section>

          {/* ——— The draft ——— */}
          <section aria-label="The draft" className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-display text-xl font-semibold text-ink">The draft</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Compose whenever you like — then edit freely below. Composing again replaces the
              draft with a fresh weave of your answers.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button
                type="button"
                onClick={() =>
                  setDraft(composeDraft({ name, nickname, answers, pronoun, verseId }))
                }
              >
                ✒️ Compose the draft
              </Button>
              {estimate.label ? (
                <span className="text-xs text-ink-faint">{estimate.label}</span>
              ) : null}
            </div>
            <textarea
              aria-label="Eulogy draft"
              className={`${inputCls} mt-4 min-h-[32rem] resize-y font-serif text-[0.98rem] leading-relaxed`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Your draft will appear here — or simply begin writing in your own way."
            />
            <p className="mt-3 text-xs leading-relaxed text-ink-faint">
              Written and kept on this device alone. When it is ready, print the pulpit copy —
              large type, generous spacing — for whoever stands up to speak.
            </p>
          </section>
        </div>
      </Container>

      {/* ——— The pulpit copy (the only thing that prints) ——— */}
      {draftParagraphs.length > 0 ? (
        <Container className="pb-10">
          <div className="no-print mx-auto max-w-[7.6in] border-b border-line pb-2 text-center text-xs uppercase tracking-[0.2em] text-ink-faint">
            Pulpit copy preview
          </div>
          <section className="print-page mx-auto mt-4 w-full max-w-[7.6in] border border-line bg-white px-14 py-16 shadow-lift">
            <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold">
              In loving memory
            </p>
            <h2 className="mt-2 text-center font-display text-3xl font-medium text-ink">
              {name || "A Life Remembered"}
            </h2>
            <div aria-hidden className="my-6 flex items-center justify-center gap-3 text-gold">
              <span className="h-px w-16 bg-current opacity-60" />
              <span className="text-lg leading-none">✝</span>
              <span className="h-px w-16 bg-current opacity-60" />
            </div>
            <div className="space-y-6 font-serif text-[1.25rem] leading-[1.9] text-ink">
              {draftParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <p className="mt-10 text-center text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
              {estimate.label}
            </p>
          </section>
        </Container>
      ) : null}
    </div>
  );
}
