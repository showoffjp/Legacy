/**
 * v11: the guided eulogy studio — interview answers woven into an
 * editable draft, pronouns respected, verse included, speaking-time
 * estimate shown, work persisted on-device, and a large-type pulpit
 * copy that is the only thing that prints.
 */
import { BASE, launch, makeChecker, watchErrors } from "./helpers.mjs";

const { check, summary } = makeChecker("eulogy");
const errors = [];
const browser = await launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
watchErrors(page, errors, "eulogy");

// Give the plan a name so the studio greets the right person.
await page.goto(`${BASE}/plan`, { waitUntil: "networkidle" });
await page.getByLabel("Full name").fill("Eleanor Mae Thompson");
await page.getByLabel("Known to loved ones as").fill("Nana Ellie");

await page.goto(`${BASE}/plan/eulogy`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
check(
  "studio greets the loved one by name",
  ((await page.locator("h1").textContent()) ?? "").includes("Eleanor Mae Thompson"),
);

// The interview.
await page.getByLabel("Speaking of them as").selectOption("she");
await page.getByLabel(/^A verse to hold the room/).selectOption({ label: "Psalm 23" });
await page
  .getByLabel(/^Who were they to you\?/)
  .fill("my grandmother — and my first Sunday school teacher");
await page
  .getByLabel(/^Tell one story that captures them\./)
  .fill("the summer the church flooded, she was first through the door with a mop");
await page
  .getByLabel(/^What will you miss most\?/)
  .fill("her voice on the phone on Sunday afternoons");

await page.getByRole("button", { name: /Compose the draft/ }).click();
const draft = await page.getByLabel("Eulogy draft").inputValue();
check("draft opens with thanksgiving", draft.startsWith("We are gathered to give thanks"));
check("draft carries the nickname", draft.includes("Nana Ellie"));
check("draft uses her pronouns", draft.includes("To me, she was my grandmother"));
check("draft weaves the story", draft.includes("first through the door with a mop"));
check("draft weaves what will be missed", draft.includes("Her voice on the phone"));
check("draft holds the verse", draft.includes("The LORD is my shepherd"));
check("draft ends in hope", draft.includes("Until we meet again"));
check(
  "speaking estimate shown",
  ((await page.locator("main").textContent()) ?? "").includes("at a gentle pace"),
);

// The family's edits are theirs — and they survive a reload.
await page.getByLabel("Eulogy draft").fill(`${draft}\n\nShe would have hated this much fuss.`);
await page.waitForTimeout(400);
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(600);
const restored = await page.getByLabel("Eulogy draft").inputValue();
check("edited draft survives a reload", restored.includes("hated this much fuss"));

// Pulpit copy previews on screen and is all that prints.
check(
  "pulpit copy previews",
  ((await page.locator("section.print-page").textContent()) ?? "").includes(
    "hated this much fuss",
  ),
);
await page.emulateMedia({ media: "print" });
check(
  "print media hides the studio",
  !(await page.getByRole("button", { name: /Compose the draft/ }).isVisible()),
);
check(
  "print media keeps the pulpit copy",
  await page.locator("section.print-page").isVisible(),
);
await page.emulateMedia({ media: "screen" });

await browser.close();
summary(errors);
