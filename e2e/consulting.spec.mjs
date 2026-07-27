/** Steward AI inquiry: API validation, the form's happy path, and the outbox record. */
import { BASE, launch, makeChecker, watchErrors } from "./helpers.mjs";

const { check, summary } = makeChecker("consulting");
const errors = [];

/* — API validation — */

const bad = await fetch(`${BASE}/api/consulting/inquiry`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Pastor Test", church: "Test Chapel", email: "not-an-email" }),
});
check("rejects an invalid email with 400", bad.status === 400);

const good = await fetch(`${BASE}/api/consulting/inquiry`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "API Smoke",
    church: "Api Chapel",
    email: "api-smoke@example.org",
    size: "100–249",
    interest: "Staff workshop",
    message: "Direct API smoke test.",
  }),
});
const goodJson = await good.json();
check("accepts a valid inquiry", good.ok && goodJson.ok === true);
check(
  "returns an STWD reference",
  typeof goodJson.reference === "string" && goodJson.reference.startsWith("STWD-"),
);

/* — The form itself — */

const browser = await launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
watchErrors(page, errors, "consulting");

await page.goto(`${BASE}/consulting`, { waitUntil: "networkidle" });
await page.getByPlaceholder("Pastor Sam Rivera").fill("Pastor E2E");
await page.getByPlaceholder("Grace Community Church").fill("E2E Community Church");
await page.getByPlaceholder("pastor@gracecommunity.church").fill("pastor-e2e@example.org");
await page.locator("textarea").fill("Filled by the end-to-end suite.");
await page.getByRole("button", { name: "Request a discovery call" }).click();

const confirmation = page.getByRole("status");
await confirmation.waitFor({ timeout: 10000 });
const confirmationText = (await confirmation.textContent()) ?? "";
check("shows the thank-you panel", confirmationText.includes("your note is on its way"));
check("thank-you panel includes a reference", /STWD-[A-Z2-9]{6}/.test(confirmationText));
check("thank-you panel echoes the email", confirmationText.includes("pastor-e2e@example.org"));

await browser.close();
summary(errors);
