"use client";

import { useState } from "react";
import { Button, Field, formatLongDate, inputCls } from "@/components/ui";
import {
  CREDIT_BUREAUS,
  INSTITUTION_KINDS,
  RELATIONSHIPS,
  type InstitutionKind,
} from "@/lib/data/estate";

/**
 * Notification & account-closure letters, composed entirely in the
 * browser. Nothing typed here is sent to or stored by Legacy — the
 * letters exist only on this device until they are printed.
 */

interface InstitutionRow {
  id: number;
  name: string;
  kind: InstitutionKind;
  account: string;
}

const RELATION_PHRASES: Record<string, string> = {
  "Executor of the estate": "I am the executor of their estate",
  "Personal representative": "I am the personal representative of their estate",
  "Surviving spouse": "I am their surviving spouse",
  Son: "I am their son",
  Daughter: "I am their daughter",
  "Family member": "I am a member of their family, handling their affairs",
};

function requestFor(kind: InstitutionKind): string {
  return (
    INSTITUTION_KINDS.find((k) => k.id === kind)?.request ??
    INSTITUTION_KINDS[INSTITUTION_KINDS.length - 1].request
  );
}

export function LetterBuilder() {
  const [sender, setSender] = useState({
    name: "",
    relationship: RELATIONSHIPS[0] as string,
    address: "",
    phone: "",
    email: "",
  });
  const [deceased, setDeceased] = useState({ name: "", deathDate: "" });
  const [rows, setRows] = useState<InstitutionRow[]>([
    { id: 1, name: "", kind: "bank", account: "" },
  ]);
  const [nextId, setNextId] = useState(2);

  const addRow = (partial?: Partial<InstitutionRow>) => {
    setRows((r) => [...r, { id: nextId, name: "", kind: "bank", account: "", ...partial }]);
    setNextId((n) => n + 1);
  };

  const addBureaus = () => {
    setRows((r) => {
      const existing = new Set(r.map((row) => row.name));
      const additions = CREDIT_BUREAUS.filter((b) => !existing.has(b)).map((b, i) => ({
        id: nextId + i,
        name: b,
        kind: "credit-bureau" as InstitutionKind,
        account: "",
      }));
      return [...r.filter((row) => row.name || row.account), ...additions];
    });
    setNextId((n) => n + CREDIT_BUREAUS.length);
  };

  const updateRow = (id: number, patch: Partial<InstitutionRow>) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const removeRow = (id: number) => {
    setRows((r) => r.filter((row) => row.id !== id));
  };

  const ready = sender.name.trim() && deceased.name.trim();
  const letters = ready ? rows.filter((row) => row.name.trim()) : [];

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const deathDateText = deceased.deathDate ? formatLongDate(deceased.deathDate) : "";
  const relationPhrase =
    RELATION_PHRASES[sender.relationship] ?? RELATION_PHRASES["Family member"];
  const addressLines = sender.address
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const contactLine = [sender.phone.trim(), sender.email.trim()].filter(Boolean).join(" · ");

  return (
    <div>
      {/* ——— The form (never printed) ——— */}
      <div className="no-print mx-auto max-w-3xl space-y-8">
        <p className="rounded-2xl border border-sage/40 bg-sage/10 px-5 py-4 text-sm leading-relaxed text-ink-soft">
          <span className="font-medium text-ink">Written on your device alone.</span> Nothing you
          type here is sent to or stored by Legacy — the letters live only on this page until you
          print them.
        </p>

        <fieldset>
          <legend className="mb-4 text-sm font-medium text-ink">About you</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your full name">
              <input
                className={inputCls}
                value={sender.name}
                onChange={(e) => setSender((s) => ({ ...s, name: e.target.value }))}
                placeholder="Ruth Callahan"
                autoComplete="off"
              />
            </Field>
            <Field label="You are writing as">
              <select
                className={inputCls}
                value={sender.relationship}
                onChange={(e) => setSender((s) => ({ ...s, relationship: e.target.value }))}
              >
                {RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Your mailing address" hint="Where replies should be sent.">
              <textarea
                className={`${inputCls} min-h-20 resize-y`}
                value={sender.address}
                onChange={(e) => setSender((s) => ({ ...s, address: e.target.value }))}
                placeholder={"412 Chestnut Lane\nNashville, TN 37203"}
              />
            </Field>
            <div className="space-y-4">
              <Field label="Phone (optional)">
                <input
                  className={inputCls}
                  type="tel"
                  value={sender.phone}
                  onChange={(e) => setSender((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="(615) 555-0123"
                />
              </Field>
              <Field label="Email (optional)">
                <input
                  className={inputCls}
                  type="email"
                  value={sender.email}
                  onChange={(e) => setSender((s) => ({ ...s, email: e.target.value }))}
                  placeholder="ruth@example.com"
                />
              </Field>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-4 text-sm font-medium text-ink">Your loved one</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Their full legal name">
              <input
                className={inputCls}
                value={deceased.name}
                onChange={(e) => setDeceased((d) => ({ ...d, name: e.target.value }))}
                placeholder="Eleanor Mae Thompson"
                autoComplete="off"
              />
            </Field>
            <Field label="Date of passing">
              <input
                type="date"
                className={inputCls}
                value={deceased.deathDate}
                onChange={(e) => setDeceased((d) => ({ ...d, deathDate: e.target.value }))}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-1 text-sm font-medium text-ink">Who needs to be told</legend>
          <p className="mb-4 text-xs text-ink-faint">
            One letter is composed for each institution. Their bank and card statements are the
            surest list of who to notify.
          </p>
          <div className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid gap-3 rounded-2xl border border-line bg-white/80 p-4 shadow-soft sm:grid-cols-[1.4fr_1.1fr_1fr_auto]"
              >
                <input
                  className={inputCls}
                  value={row.name}
                  onChange={(e) => updateRow(row.id, { name: e.target.value })}
                  placeholder="First National Bank"
                  aria-label="Institution name"
                />
                <select
                  className={inputCls}
                  value={row.kind}
                  onChange={(e) => updateRow(row.id, { kind: e.target.value as InstitutionKind })}
                  aria-label="Institution type"
                >
                  {INSTITUTION_KINDS.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.label}
                    </option>
                  ))}
                </select>
                <input
                  className={inputCls}
                  value={row.account}
                  onChange={(e) => updateRow(row.id, { account: e.target.value })}
                  placeholder="Account ending 4412"
                  aria-label="Account reference (optional)"
                />
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  className="self-center rounded-full px-3 py-2 text-xs font-medium text-ink-faint transition-colors hover:bg-rose-50 hover:text-rose-700"
                  aria-label={`Remove ${row.name || "this institution"}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => addRow()}>
              + Add an institution
            </Button>
            <Button type="button" variant="ghost" onClick={addBureaus}>
              Add the three credit bureaus
            </Button>
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
          <Button type="button" onClick={() => window.print()} disabled={letters.length === 0}>
            🖨️ Print {letters.length === 1 ? "the letter" : `all ${letters.length} letters`}
          </Button>
          <p className="text-xs leading-relaxed text-ink-faint">
            Enclose a certified copy of the death certificate with each letter, and send by
            certified mail where the account matters.
          </p>
        </div>
      </div>

      {/* ——— The letters (the only thing that prints) ——— */}
      <div className="mx-auto mt-12 max-w-3xl space-y-8 print:mt-0 print:space-y-0">
        {letters.length === 0 ? (
          <p className="no-print rounded-2xl border border-dashed border-line bg-white/60 px-6 py-10 text-center text-sm text-ink-faint">
            Your letters will appear here as you fill in the names above.
          </p>
        ) : (
          letters.map((row) => (
            <article
              key={row.id}
              className="print-page rounded-2xl border border-line bg-white p-8 font-serif text-[0.95rem] leading-relaxed text-ink shadow-soft sm:p-10"
            >
              <div className="whitespace-pre-line">
                {sender.name}
                {addressLines.length > 0 ? `\n${addressLines.join("\n")}` : ""}
                {contactLine ? `\n${contactLine}` : ""}
              </div>
              <p className="mt-6">{today}</p>
              <div className="mt-6">
                <p>{row.name}</p>
                <p>Attention: Estate / Deceased Accounts Department</p>
              </div>
              <p className="mt-6 font-medium">
                Re: {deceased.name}
                {deathDateText ? ` — deceased ${deathDateText}` : ", deceased"}
                {row.account.trim() ? ` · ${row.account.trim()}` : ""}
              </p>
              <p className="mt-6">To whom it may concern:</p>
              <p className="mt-4">
                I write to inform you that {deceased.name} passed away
                {deathDateText ? ` on ${deathDateText}` : " recently"}. {relationPhrase}.
              </p>
              <p className="mt-4">{requestFor(row.kind)}</p>
              <p className="mt-4">
                A certified copy of the death certificate is enclosed. Please direct all future
                correspondence regarding this matter to me at the address above.
              </p>
              <p className="mt-4">Thank you for your care in this matter.</p>
              <p className="mt-8">Sincerely,</p>
              <div className="mt-10">
                <p className="border-t border-ink/40 pt-1">{sender.name}</p>
                <p className="text-sm text-ink-soft">{sender.relationship}</p>
              </div>
              <p className="mt-6 text-sm text-ink-soft">Enclosure: certified death certificate</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
