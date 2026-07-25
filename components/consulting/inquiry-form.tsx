"use client";

import { useState, type FormEvent } from "react";
import { Button, Field, inputCls } from "@/components/ui";

// One place to change when inquiries should land somewhere else.
export const INQUIRY_EMAIL = "jason@pharrgo.com";

const CHURCH_SIZES = [
  "Under 100 in weekly attendance",
  "100–249",
  "250–499",
  "500–999",
  "1,000 or more / multisite",
];

const INTERESTS = [
  "Staff workshop",
  "AI Readiness Assessment & Policy",
  "Implementation sprint",
  "Fractional AI Director (retainer)",
  "Not sure yet — let's talk",
];

/**
 * A no-backend inquiry form: it composes a mailto so nothing sensitive is
 * stored anywhere, and the church's mail client keeps its own record.
 */
export function InquiryForm() {
  const [name, setName] = useState("");
  const [church, setChurch] = useState("");
  const [size, setSize] = useState(CHURCH_SIZES[0]);
  const [interest, setInterest] = useState(INTERESTS[4]);
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = `Discovery call — ${church || "our church"}`;
    const body = [
      `Name: ${name}`,
      `Church: ${church}`,
      `Size: ${size}`,
      `Interested in: ${interest}`,
      "",
      message,
    ].join("\n");
    window.location.href = `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
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
        <Field label="Congregation size">
          <select className={inputCls} value={size} onChange={(e) => setSize(e.target.value)}>
            {CHURCH_SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
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
      </div>
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
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variant="heaven">
          Compose the email
        </Button>
        <p className="text-xs text-ink-faint">
          Opens in your mail app — nothing is stored on this site. Or write us directly at{" "}
          <a className="font-medium text-gold-deep hover:underline" href={`mailto:${INQUIRY_EMAIL}`}>
            {INQUIRY_EMAIL}
          </a>
          .
        </p>
      </div>
    </form>
  );
}
