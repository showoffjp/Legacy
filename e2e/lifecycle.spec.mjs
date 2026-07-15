/**
 * The full family lifecycle: account, cloud-synced plan, coordination
 * request, published memorial with RSVP + guestbook, checkout, partner
 * application, and the coordinator console.
 */
import { BASE, launch, makeChecker, watchErrors } from "./helpers.mjs";

const { check, summary } = makeChecker("lifecycle");
const errors = [];
const email = `ruth.${Date.now()}@example.com`;
const pass = "green-pastures-23";

const browser = await launch();

/* ——— Device 1: the family ——— */
const ctx1 = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const p1 = await ctx1.newPage();
watchErrors(p1, errors, "family");

await p1.goto(`${BASE}/account`, { waitUntil: "networkidle" });
await p1.getByRole("button", { name: /Create an account/i }).first().click();
await p1.getByLabel(/name/i).first().fill("Ruth Callahan");
await p1.getByLabel(/email/i).first().fill(email);
await p1.getByLabel(/password/i).first().fill(pass);
await p1.getByRole("button", { name: /create|begin|sign up/i }).last().click();
await p1.waitForURL("**/account/dashboard", { timeout: 15000 });
check("signup reaches dashboard", true);

await p1.goto(`${BASE}/plan`, { waitUntil: "networkidle" });
await p1.getByLabel("Full name").fill("Eleanor Mae Thompson");
await p1.getByLabel("Christian tradition").selectOption("Methodist");
await p1.getByLabel("Their life, in your words").fill(
  "She taught Sunday school for forty-two years and hummed hymns while she gardened.",
);
await p1.getByRole("button", { name: "The Service", exact: true }).click();
await p1.getByRole("button", { name: /Memorial Service/ }).click();
await p1.getByLabel("State").selectOption("TN");
await p1.getByLabel("City").fill("Nashville");
await p1.getByLabel("Service date").fill("2026-08-01");
await p1.getByRole("button", { name: "Music & Scripture", exact: true }).click();
await p1.getByRole("checkbox").first().check();
await p1.waitForTimeout(2500); // cloud sync debounce
check(
  "wizard reflects account sync",
  (await p1.locator("main").textContent())?.includes("saved to your account") ?? false,
);

// Coordination request
await p1.getByRole("button", { name: "Review", exact: true }).click();
await p1.getByLabel("Your name").fill("Ruth Callahan");
await p1.getByLabel("Email", { exact: true }).fill(email);
await p1.getByRole("button", { name: "Send to our coordinator" }).click();
await p1.getByText(/reference LGCY-/).first().waitFor({ timeout: 15000 });
const refText = await p1.getByText(/reference LGCY-/).first().textContent();
const coordRef = (refText?.match(/LGCY-[A-Z0-9]{6}/) || [""])[0];
check(`coordination reference issued (${coordRef})`, coordRef.startsWith("LGCY-"));

// Publish the memorial
await p1.getByRole("button", { name: /Publish their memorial page/ }).click();
const memorialLink = p1.getByRole("link", { name: /Visit their memorial page/ });
await memorialLink.waitFor({ timeout: 15000 });
const memorialHref = await memorialLink.getAttribute("href");
check(`memorial published (${memorialHref})`, Boolean(memorialHref?.startsWith("/memorials/")));

// Visit it: service details, RSVP, guestbook
await p1.goto(`${BASE}${memorialHref}`, { waitUntil: "networkidle" });
const memorialText = await p1.locator("main").textContent();
check("memorial shows the loved one", memorialText?.includes("Eleanor Mae Thompson") ?? false);
check("memorial shows service details", memorialText?.includes("Memorial Service") ?? false);
check("memorial offers calendar file", memorialText?.includes("Add the service to your calendar") ?? false);

const rsvpSection = p1.locator('section[aria-label="Service details"]');
await rsvpSection.getByLabel("Your name").fill("The Lewis family");
await rsvpSection.getByLabel("In your party").fill("3");
await rsvpSection.getByRole("button", { name: "Send RSVP" }).click();
await rsvpSection.getByText(/comforted to know/).waitFor({ timeout: 15000 });
check("RSVP recorded", true);

const guestbook = p1.locator('section[aria-label="Guestbook"]');
await guestbook.getByLabel("Your name").fill("Margaret Lewis");
await guestbook.getByLabel("Your message").fill("Her kindness shaped our whole family.");
await guestbook.getByRole("button", { name: "Sign the guestbook" }).click();
await guestbook.getByText(/part of their remembrance/).waitFor({ timeout: 15000 });
check(
  "condolence appears",
  (await guestbook.textContent())?.includes("Margaret Lewis") ?? false,
);

// The ICS calendar file downloads
const ics = await p1.evaluate(async (href) => {
  const res = await fetch(`${href}/service.ics`);
  return { ok: res.ok, body: await res.text() };
}, memorialHref);
check("calendar file serves VEVENT", ics.ok && ics.body.includes("BEGIN:VEVENT"));

// Checkout
await p1.goto(`${BASE}/pricing`, { waitUntil: "networkidle" });
await p1.getByRole("link", { name: /Begin with this package/ }).nth(1).click();
await p1.waitForURL("**/checkout?package=*");
await p1.getByLabel(/your name/i).fill("Ruth Callahan");
await p1.getByLabel(/email/i).fill(email);
await p1.getByRole("button", { name: /Continue to payment/ }).click();
await p1.waitForURL("**/checkout/ORD-*", { timeout: 15000 });
await p1.getByRole("button", { name: /Confirm — complete this order/ }).click();
await p1.waitForURL("**/receipt", { timeout: 15000 });
check("checkout completes to receipt", (await p1.locator("main").textContent())?.includes("Thank you") ?? false);

// Dashboard aggregates everything
await p1.goto(`${BASE}/account/dashboard`, { waitUntil: "networkidle" });
const dash = await p1.locator("main").textContent();
check("dashboard shows plan", dash?.includes("Eleanor Mae Thompson") ?? false);
check("dashboard shows coordination reference", dash?.includes(coordRef) ?? false);
check("dashboard shows memorial guestbook count", dash?.includes("1 condolence") ?? false);
check("dashboard shows RSVP tally", dash?.includes("3 guests") ?? false);
check("dashboard shows order", dash?.includes("The Traditional") ?? false);

// Partner application
await p1.goto(`${BASE}/partners`, { waitUntil: "networkidle" });
const orgName = `Still Waters ${Date.now()}`;
await p1.getByLabel(/organization/i).fill(orgName);
await p1.locator("select").first().selectOption("funeral-home");
await p1.getByLabel(/contact name|who we should speak/i).first().fill("James Porter");
await p1.getByLabel(/email/i).first().fill("james@stillwaters.example.com");
await p1.getByRole("button", { name: /apply|submit|send/i }).click();
await p1.getByText(/application received/i).waitFor({ timeout: 15000 });
check("partner application received", true);
await ctx1.close();

/* ——— Device 2: the plan follows the account ——— */
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const p2 = await ctx2.newPage();
watchErrors(p2, errors, "device2");
await p2.goto(`${BASE}/account`, { waitUntil: "networkidle" });
await p2.getByLabel(/email/i).first().fill(email);
await p2.getByLabel(/password/i).first().fill(pass);
await p2.getByRole("button", { name: /sign in/i }).last().click();
await p2.waitForURL("**/account/dashboard", { timeout: 15000 });
await p2.goto(`${BASE}/plan`, { waitUntil: "networkidle" });
await p2.waitForTimeout(1500);
check(
  "plan synced to second device",
  (await p2.getByLabel("Full name").inputValue()) === "Eleanor Mae Thompson",
);
await ctx2.close();

/* ——— The coordinator console ——— */
const ctx3 = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
const p3 = await ctx3.newPage();
watchErrors(p3, errors, "coordinator");
await p3.goto(`${BASE}/account`, { waitUntil: "networkidle" });
await p3.getByLabel(/email/i).first().fill("coordinator@legacy.example");
await p3.getByLabel(/password/i).first().fill(process.env.LEGACY_ADMIN_PASSWORD || "walk-beside-families");
await p3.getByRole("button", { name: /sign in/i }).last().click();
await p3.waitForURL("**/admin", { timeout: 15000 });
const admin = await p3.locator("main").textContent();
check("console shows the coordination request", admin?.includes(coordRef) ?? false);
check("console shows the partner application", admin?.includes(orgName) ?? false);
check("console shows the outbox", /outbox/i.test(admin ?? ""));

await p3.locator('select[name="status"]').first().selectOption("confirmed");
await p3.getByRole("button", { name: /^Update$/ }).first().click();
await p3.waitForTimeout(1200);
check(
  "status update applied",
  (await p3.locator("main").textContent())?.includes("confirmed") ?? false,
);
await ctx3.close();

await browser.close();
summary(errors);
