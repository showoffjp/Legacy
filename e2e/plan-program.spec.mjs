/**
 * The planning wizard: location-based funeral home matching, denomination
 * clergy matching, and the plan flowing into the printable program and
 * obituary.
 */
import { BASE, launch, makeChecker, watchErrors } from "./helpers.mjs";

const { check, summary } = makeChecker("plan-program");
const errors = [];
const browser = await launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
watchErrors(page, errors, "plan");

await page.goto(`${BASE}/plan`, { waitUntil: "networkidle" });
await page.getByLabel("Full name").fill("Deacon Robert Earl Hayes");
await page.getByLabel("Christian tradition").selectOption("Baptist");

await page.getByRole("button", { name: "The Service", exact: true }).click();
await page.getByRole("button", { name: /Traditional Burial/ }).click();
await page.getByLabel("State").selectOption("GA");
await page.getByLabel("City").fill("Atlanta");

await page.getByRole("button", { name: "Funeral Home", exact: true }).click();
const firstHome = await page.locator("h3").first().textContent();
check("Atlanta funeral home offered first", firstHome?.includes("Morning Star") ?? false);
await page.getByRole("button", { name: "Choose this funeral home" }).first().click();

await page.getByRole("button", { name: "Pastor or Priest", exact: true }).click();
check(
  "clergy filtered to Baptist",
  (await page.locator("main").getByText("Baptist", { exact: true }).count()) > 0,
);
await page.getByRole("button", { name: "Request this minister" }).first().click();

await page.getByRole("button", { name: "Casket or Urn", exact: true }).click();
await page.getByRole("button", { name: /Choose · \$2,650/ }).click();

await page.getByRole("button", { name: "Honors & Add-ons", exact: true }).click();
await page.getByRole("button", { name: /Add · no charge/ }).click(); // Military Funeral Honors

await page.getByRole("button", { name: "Music & Scripture", exact: true }).click();
await page.getByRole("checkbox").first().check();
await page.getByText("Psalm 23", { exact: true }).click();

await page.getByRole("button", { name: "Review", exact: true }).click();
const review = await page.locator("main").textContent();
for (const expected of ["Deacon Robert Earl Hayes", "Morning Star", "Amazing Grace", "Psalm 23", "The Bethany", "Military Funeral Honors"]) {
  check(`review shows ${expected}`, review?.includes(expected) ?? false);
}

await page.goto(`${BASE}/plan/program`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const program = await page.locator("main").textContent();
for (const expected of ["Deacon Robert Earl Hayes", "Order of Service", "Amazing Grace", "Psalm 23", "Morning Star", "Military Honors"]) {
  check(`program shows ${expected}`, program?.includes(expected) ?? false);
}

await page.emulateMedia({ media: "print" });
check(
  "print media hides the toolbar",
  !(await page.getByRole("button", { name: /Print the program/ }).first().isVisible()),
);
await page.emulateMedia({ media: "screen" });

await page.goto(`${BASE}/plan/obituary`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const obit = await page.locator("body").textContent();
for (const expected of ["went home to be with the Lord", "Deacon Robert Earl Hayes", "Services entrusted to Morning Star"]) {
  check(`obituary shows ${expected}`, obit?.includes(expected) ?? false);
}

await browser.close();
summary(errors);
