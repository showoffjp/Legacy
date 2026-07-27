"use client";

import { useState, type FormEvent } from "react";
import { Button, Field, inputCls } from "@/components/ui";
import { CHURCH_SIZES, INQUIRY_EMAIL, INTERESTS } from "@/lib/consulting";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * The discovery-call form. Submissions post to /api/consulting/inquiry,
 * which stores the note and emails both sides; if the request fails the
 * form falls back to composing the same note in the visitor's mail app.
 */
export function InquiryForm() {
  const [name, setName] = useState("");
  const [church, setChurch] = useState("");
  const [email, setEmail] = useState("");
  const [size, setSize] = useState(CHURCH_SIZES[0]);
  const [interest, setInterest] = useState(INTERESTS[4]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  const mailtoHref = () => {
    const subject = `Discovery call — ${church || "our church"}`;
    const body = [
      `Name: ${name}`,
      `Church: ${church}`,
      `Email: ${email}`,
      `Size: ${size}`,
      `Interested in: ${interest}`,
      "",
      message,
    ].join("\n");
    return `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/consulting/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, church, email, size, interest, message }),
      });
      const data = (await res.json()) as { ok?: boolean; reference?: string; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong on our end.");
        setStatus("error");
        return;
      }
      setReference(data.reference ?? "");
      setStatus("sent");
    } catch {
      setError("We couldn't reach the server.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-sage/40 bg-sage/10 p-6 sm:p-8" role="status">
        <p className="font-display text-2xl font-medium text-ink">
          Thank you — your note is on its way.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          We&apos;ve sent a confirmation to <span className="font-medium text-ink">{email}</span>{" "}
          and a real person will reply within two business days. Your reference is{" "}
          <span className="font-mono font-semibold text-gold-deep">{reference}</span>.
        </p>
        <p className="mt-3 text-xs text-ink-faint">
          Anything urgent in the meantime? Write us at{" "}
          <a className="font-medium text-gold-deep hover:underline" href={`mailto:${INQUIRY_EMAIL}`}>
            {INQUIRY_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name">
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pastor Sam Rivera"
            required
          />
        </Field>
        <Field label="Church name">
          <input
            className={inputCls}
            value={church}
            onChange={(e) => setChurch(e.target.value)}
            placeholder="Grace Community Church"
            required
          />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your email" hint="Only used to reply to this note.">
          <input
            className={inputCls}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="pastor@gracecommunity.church"
            required
          />
        </Field>
        <Field label="Congregation size">
          <select className={inputCls} value={size} onChange={(e) => setSize(e.target.value)}>
            {CHURCH_SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="What are you exploring?">
        <select
          className={inputCls}
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        >
          {INTERESTS.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </Field>
      <Field
        label="Anything you'd like us to know?"
        hint="Where is AI already showing up on your team? What worries you most?"
      >
        <textarea
          className={`${inputCls} min-h-28`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="We have three staff quietly using chatbots and no policy…"
        />
      </Field>
      {status === "error" && (
        <p className="text-sm text-red-700" role="alert">
          {error}{" "}
          <a className="font-medium text-gold-deep hover:underline" href={mailtoHref()}>
            Send it from your mail app instead
          </a>
          .
        </p>
      )}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variant="heaven" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Request a discovery call"}
        </Button>
        <p className="text-xs text-ink-faint">
          Kept only so we can reply — never shared, never marketed to. Prefer your own mail app?{" "}
          <a className="font-medium text-gold-deep hover:underline" href={`mailto:${INQUIRY_EMAIL}`}>
            {INQUIRY_EMAIL}
          </a>
          .
        </p>
      </div>
    </form>
  );
}
