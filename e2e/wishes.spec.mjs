/**
 * Pre-planning: the wizard's pre-need mode and the printable Letter of
 * Wishes and acknowledgment cards it produces.
 */
import { BASE, launch, makeChecker, watchErrors } from "./helpers.mjs";

const { check, summary } = makeChecker("wishes");
const errors = [];
const browser = await launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
watchErrors(page, errors, "wishes");

await page.goto(`${BASE}/plan`, { waitUntil: "networkidle" });

// Choose pre-planning
await page.getByRole("button", { name: /Planning ahead — recording wishes/ }).click();
check(
  "date of passing hidden in pre-need mode",
  (await page.getByLabel("Date of passing").count()) === 0,
);
await page.getByLabel("Full name").fill("Harold James Whitmore");
await page.getByLabel("Date of birth").fill("1949-03-15");

const header = await page.locator("h1").textContent();
check("wizard header reads as a plan of wishes", header?.includes("A plan of wishes for") ?? false);

// A few choices to appear in the letter
await page.getByRole("button", { name: "The Service", exact: true }).click();
await page.getByRole("button", { name: /Traditional Burial/ }).click();
await page.getByRole("button", { name: "Music & Scripture", exact: true }).click();
await page.getByRole("checkbox").first().check();

// Review reflects pre-need copy
await page.getByRole("button", { name: "Review", exact: true }).click();
const review = await page.locator("main").textContent();
check("review offers the Letter of Wishes", review?.includes("Letter of Wishes") ?? false);
check(
  "review coordination copy shifts to safekeeping",
  review?.includes("Place these wishes in our safekeeping") ?? false,
);
check(
  "memorial publishing hidden in pre-need mode",
  !(review?.includes("Publish their memorial page") ?? true),
);

// The printable letter
await page.goto(`${BASE}/plan/wishes`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const letter = await page.locator("body").textContent();
for (const expected of [
  "A Letter of Wishes",
  "Harold James Whitmore",
  "A traditional burial",
  "Amazing Grace",
  "Signature",
  "Witness",
]) {
  check(`letter shows ${expected}`, letter?.includes(expected) ?? false);
}

// Acknowledgment cards render from the same plan
await page.goto(`${BASE}/plan/cards`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const cards = await page.locator("body").textContent();
check("cards show the family attribution", cards?.includes("The Family of Harold James Whitmore") ?? false);
check(
  "cards carry the acknowledgment text",
  cards?.includes("heartfelt gratitude") ?? false,
);

await browser.close();
summary(errors);
