"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  submitPartnerApplication,
  type PartnerFormState,
} from "@/app/partners/actions";
import { Button, Card, Field, inputCls } from "@/components/ui";

const INITIAL_STATE: PartnerFormState = { ok: false, error: "" };

export interface CategoryOption {
  value: string;
  label: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending your application…" : "Send application"}
    </Button>
  );
}

export function PartnerApplicationForm({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const [state, formAction] = useActionState(submitPartnerApplication, INITIAL_STATE);

  if (state.ok) {
    return (
      <Card className="p-8 sm:p-10">
        <div role="status" className="flex flex-col items-center gap-3 text-center">
          <span aria-hidden className="font-display text-3xl text-gold">
            ✝
          </span>
          <h3 className="font-display text-2xl font-medium text-ink">
            Thank you — application received
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-ink-soft">
            Our care team reviews every application personally — licensing, references,
            and above all a heart for families in grief. You will hear from us within
            two business days.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 sm:p-10">
      <form action={formAction} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Organization name">
            <input
              type="text"
              name="orgName"
              className={inputCls}
              placeholder="Your organization or congregation"
              required
            />
          </Field>
          <Field label="Kind of care you provide">
            <select name="category" className={inputCls} defaultValue="" required>
              <option value="" disabled>
                Choose one
              </option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Contact name">
            <input
              type="text"
              name="contactName"
              className={inputCls}
              placeholder="Who should we speak with"
              required
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              name="email"
              className={inputCls}
              placeholder="you@example.com"
              required
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              name="phone"
              className={inputCls}
              placeholder="(555) 555-0100"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-[1fr_7rem_9rem]">
          <Field label="City">
            <input type="text" name="city" className={inputCls} placeholder="City" />
          </Field>
          <Field label="State" hint="Two letters">
            <input
              type="text"
              name="state"
              className={`${inputCls} uppercase`}
              maxLength={2}
              placeholder="TX"
              autoComplete="address-level1"
            />
          </Field>
          <Field label="ZIP">
            <input
              type="text"
              name="zip"
              className={inputCls}
              inputMode="numeric"
              maxLength={10}
              placeholder="75201"
            />
          </Field>
        </div>

        <Field label="Website" hint="Optional — where families can learn about your work.">
          <input
            type="url"
            name="website"
            className={inputCls}
            placeholder="https://your-organization.com"
          />
        </Field>

        <Field label="Tell us about your ministry to grieving families">
          <textarea
            name="message"
            rows={5}
            className={`${inputCls} min-h-32 resize-y`}
            placeholder="How you serve, how long you have served, and the families you feel called to care for"
          />
        </Field>

        {state.error ? (
          <p
            role="alert"
            className="rounded-xl border border-gold bg-gold-pale/60 px-4 py-3 text-sm text-gold-deep"
          >
            {state.error}
          </p>
        ) : null}

        <div className="flex flex-col items-start gap-3 pt-1">
          <SubmitButton />
          <p className="text-xs text-ink-faint">
            Our care team reviews every application personally within two business days.
          </p>
        </div>
      </form>
    </Card>
  );
}
