"use client";

import { Field, inputCls } from "@/components/ui";
import { usePlan } from "@/lib/plan-context";

export function StepProgram() {
  const { plan, update } = usePlan();
  const p = plan.program;

  return (
    <div className="max-w-2xl space-y-6">
      <Field
        label="Eulogists & speakers"
        hint="One per line — printed in the order of service. Include remarks, poems, or tributes."
      >
        <textarea
          className={`${inputCls} min-h-24 resize-y`}
          value={p.eulogists}
          onChange={(e) => update({ program: { eulogists: e.target.value } })}
          placeholder={"Ruth Callahan — daughter\nSamuel Thompson — son"}
        />
      </Field>

      <Field label="Pallbearers" hint="One per line. Honorary pallbearers may be noted as such.">
        <textarea
          className={`${inputCls} min-h-24 resize-y`}
          value={p.pallbearers}
          onChange={(e) => update({ program: { pallbearers: e.target.value } })}
          placeholder={"Mark Callahan\nPeter Nguyen\nDeacons of First Baptist (honorary)"}
        />
      </Field>

      <Field
        label="Special notes for the program"
        hint="Repast location, memorial gifts in lieu of flowers, dress in their favorite color — anything guests should know."
      >
        <textarea
          className={`${inputCls} min-h-24 resize-y`}
          value={p.specialNotes}
          onChange={(e) => update({ program: { specialNotes: e.target.value } })}
          placeholder="The family invites you to a repast in the fellowship hall following the committal."
        />
      </Field>

      <Field
        label="Acknowledgment from the family"
        hint="Printed on the back of the program. A gentle default is provided — make it your own."
      >
        <textarea
          className={`${inputCls} min-h-28 resize-y`}
          value={p.acknowledgment}
          onChange={(e) => update({ program: { acknowledgment: e.target.value } })}
        />
      </Field>
    </div>
  );
}
