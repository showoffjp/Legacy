/** Every public page renders with its key content and zero console errors. */
import { BASE, launch, makeChecker, watchErrors } from "./helpers.mjs";

const PAGES = [
  ["/", "we carry the details"],
  ["/plan", "Planning a faithful farewell"],
  ["/plan/program", "The Order of Service Program"],
  ["/plan/obituary", "The Obituary"],
  ["/plan/wishes", "The Letter of Wishes"],
  ["/plan/cards", "Acknowledgment Cards"],
  ["/tribute", "Their life, in light and song"],
  ["/memorials", "Lives written in the Book of Life"],
  ["/memorials/eleanor-mae-thompson", "In Loving Memory of"],
  ["/directory?tab=clergy", "Trusted hands, vetted with care"],
  ["/checklist", "what to do, and when"],
  ["/resources", "You do not walk this valley alone"],
  ["/pricing", "Clear, honest pricing"],
  ["/partners", "Serve grieving families with us"],
  ["/account", "Kept safe, together"],
];

const { check, summary } = makeChecker("pages");
const errors = [];
const browser = await launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
watchErrors(page, errors, "pages");

for (const [path, needle] of PAGES) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  const text = await page.locator("body").textContent();
  check(`${path} shows "${needle}"`, text?.includes(needle) ?? false);
}

await browser.close();
summary(errors);
