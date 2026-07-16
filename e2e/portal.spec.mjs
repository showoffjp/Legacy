/**
 * The partner portal loop and memorial management:
 * family sends a plan → coordinator opens a portal for the funeral home →
 * the partner signs in, sees the request, confirms it → the family sees
 * the confirmation. Plus: owner edits their memorial and sets link-only
 * privacy (unlisted but reachable).
 */
import { BASE, launch, makeChecker, watchErrors } from "./helpers.mjs";

const { check, summary } = makeChecker("portal");
const errors = [];
const stamp = Date.now();
const familyEmail = `ruth.${stamp}@example.com`;
const partnerEmail = `care.${stamp}@morningstar.example.com`;
const pass = "green-pastures-23";

const browser = await launch();

/* ——— The family: plan, send, publish, manage ——— */
const fam = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
watchErrors(fam, errors, "family");

await fam.goto(`${BASE}/account`, { waitUntil: "networkidle" });
await fam.getByRole("button", { name: /Create an account/i }).first().click();
await fam.getByLabel(/name/i).first().fill("Ruth Callahan");
await fam.getByLabel(/email/i).first().fill(familyEmail);
await fam.getByLabel(/password/i).first().fill(pass);
await fam.getByRole("button", { name: /create|begin|sign up/i }).last().click();
await fam.waitForURL("**/account/dashboard", { timeout: 15000 });

await fam.goto(`${BASE}/plan`, { waitUntil: "networkidle" });
await fam.getByLabel("Full name").fill("Eleanor Mae Thompson");
await fam.getByLabel("Their life, in your words").fill("She hummed hymns while she gardened.");
await fam.getByRole("button", { name: "The Service", exact: true }).click();
await fam.getByRole("button", { name: /Traditional Burial/ }).click();
await fam.getByLabel("State").selectOption("GA");
await fam.getByLabel("City").fill("Atlanta");
await fam.getByRole("button", { name: "Funeral Home", exact: true }).click();
await fam.getByRole("button", { name: "Choose this funeral home" }).first().click(); // Morning Star (GA first)
await fam.getByRole("button", { name: "Review", exact: true }).click();
await fam.getByLabel("Your name").fill("Ruth Callahan");
await fam.getByLabel("Email", { exact: true }).fill(familyEmail);
await fam.getByRole("button", { name: "Send to our coordinator" }).click();
await fam.getByText(/reference LGCY-/).first().waitFor({ timeout: 15000 });
const refText = await fam.getByText(/reference LGCY-/).first().textContent();
const coordRef = (refText?.match(/LGCY-[A-Z0-9]{6}/) || [""])[0];
check(`coordination sent (${coordRef})`, coordRef.startsWith("LGCY-"));

// Family opens the request thread from their dashboard
await fam.goto(`${BASE}/account/dashboard`, { waitUntil: "networkidle" });
await fam.getByText("Messages", { exact: true }).click(); // expand the empty thread
await fam.getByPlaceholder("Write a message…").fill("Can the service begin at 11 o'clock?");
await fam.getByRole("button", { name: /^Send$/ }).click();
await fam.waitForTimeout(1500);
check(
  "family message posted",
  (await fam.locator("main").textContent())?.includes("11 o'clock?") ?? false,
);

// Publish + manage the memorial (back to the plan's review step)
await fam.goto(`${BASE}/plan`, { waitUntil: "networkidle" });
await fam.getByRole("button", { name: "Review", exact: true }).click();
await fam.getByRole("button", { name: /Publish their memorial page/ }).click();
const link = fam.getByRole("link", { name: /Visit their memorial page/ });
await link.waitFor({ timeout: 15000 });
const memorialHref = await link.getAttribute("href");
const slug = memorialHref?.split("/").pop() ?? "";

await fam.goto(`${BASE}/account/memorials/${slug}`, { waitUntil: "networkidle" });
check("manage page reachable by owner", (await fam.locator("h1").textContent())?.includes("Managing") ?? false);
await fam.getByLabel("Their story", { exact: false }).fill("She hummed hymns while she gardened.\nHer table was never short a chair. (edited)");
await fam.getByLabel(/Memorial gifts/).fill("In lieu of flowers, the family invites gifts to the First Baptist building fund.");
await fam.getByLabel(/Who can find this page/).selectOption("link-only");
await fam.getByRole("button", { name: "Save the memorial" }).click();
await fam.getByText(/Saved — the memorial page reflects/).waitFor({ timeout: 15000 });
check("owner edit saved", true);

await fam.goto(`${BASE}/memorials`, { waitUntil: "networkidle" });
check(
  "link-only memorial unlisted",
  (await fam.locator(`a[href="${memorialHref}"]`).count()) === 0,
);
await fam.goto(`${BASE}${memorialHref}`, { waitUntil: "networkidle" });
const pageText = await fam.locator("main").textContent();
check("link-only memorial reachable by link", pageText?.includes("Eleanor Mae Thompson") ?? false);
check("edited story shown", pageText?.includes("(edited)") ?? false);
check("gifts section shown", pageText?.includes("Memorial Gifts") ?? false);

// A guest records a gift in their memory
const gifts = fam.locator('section[aria-label="Memorial gifts"]');
await gifts.getByLabel("Your name").fill("The Lewis family");
await gifts.getByLabel(/Amount/).fill("50");
await gifts.getByRole("button", { name: /Record a gift/ }).click();
await gifts.getByText(/your kindness is recorded/).waitFor({ timeout: 15000 });
check("gift recorded", true);
await fam.close();

/* ——— The coordinator: open the partner portal ——— */
const admin = await (await browser.newContext({ viewport: { width: 1440, height: 1100 } })).newPage();
watchErrors(admin, errors, "admin");
await admin.goto(`${BASE}/account`, { waitUntil: "networkidle" });
await admin.getByLabel(/email/i).first().fill("coordinator@legacy.example");
await admin.getByLabel(/password/i).first().fill(process.env.LEGACY_ADMIN_PASSWORD || "walk-beside-families");
await admin.getByRole("button", { name: /sign in/i }).last().click();
await admin.waitForURL("**/admin", { timeout: 15000 });

await admin.getByLabel("Kind of partner").selectOption("funeral-home");
await admin.getByLabel("Which partner").selectOption("morningstar-atlanta");
await admin.getByLabel("Portal sign-in email").fill(partnerEmail);
await admin.getByLabel("Contact name").fill("Denise Porter");
await admin.getByRole("button", { name: /Open their portal/ }).click();
await admin.getByText(/Portal opened/).waitFor({ timeout: 15000 });
check("portal account created", true);

const adminText = await admin.locator("main").textContent();
const tempPassword = (adminText?.match(/Temporary password: ([a-z0-9-]+)/) || [])[1] ?? "";
check(`temp password issued via outbox (${tempPassword ? "found" : "missing"})`, tempPassword.length > 5);
await admin.close();

/* ——— The partner: sign in, see the request, confirm it ——— */
const partner = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
watchErrors(partner, errors, "partner");
await partner.goto(`${BASE}/account`, { waitUntil: "networkidle" });
await partner.getByLabel(/email/i).first().fill(partnerEmail);
await partner.getByLabel(/password/i).first().fill(tempPassword);
await partner.getByRole("button", { name: /sign in/i }).last().click();
await partner.waitForURL("**/portal", { timeout: 15000 });
const portalText = await partner.locator("main").textContent();
check("portal shows org header", (await partner.locator("h1").textContent())?.includes("Morning Star") ?? false);
check("portal shows the request", portalText?.includes(coordRef) ?? false);
check("portal shows the loved one", portalText?.includes("Eleanor Mae Thompson") ?? false);

check("partner sees the family's message", portalText?.includes("11 o'clock?") ?? false);

// Scope to this run's request card — local runs may accumulate older requests
const myCard = partner.locator("div.rounded-2xl").filter({ hasText: coordRef }).first();
await myCard.locator('select[name="status"]').selectOption("confirmed");
await myCard.getByRole("button", { name: /^Update$/ }).click();
await partner.waitForTimeout(1500);
const myCardAfter = partner.locator("div.rounded-2xl").filter({ hasText: coordRef }).first();
check(
  "partner confirmed the request",
  (await myCardAfter.locator("span", { hasText: /^confirmed$/ }).count()) > 0,
);

// Partner replies on the shared thread
await myCardAfter.getByPlaceholder("Write a message…").fill("11 o'clock is ours — consider it done.");
await myCardAfter.getByRole("button", { name: /^Send$/ }).click();
await partner.waitForTimeout(1500);
check(
  "partner reply posted",
  (await partner.locator("main").textContent())?.includes("consider it done") ?? false,
);

// Partner changes their temporary password
const newPassword = "shepherd-keeps-me-8";
await partner.goto(`${BASE}/account/settings`, { waitUntil: "networkidle" });
await partner.getByLabel("Current password").fill(tempPassword);
await partner.getByLabel(/^New password/).fill(newPassword);
await partner.getByLabel("Confirm new password").fill(newPassword);
await partner.getByRole("button", { name: /Change the password/ }).click();
await partner.getByText(/Your password is changed/).waitFor({ timeout: 15000 });
check("partner changed temporary password", true);

// …and signs back in with it
await partner.goto(`${BASE}/portal`, { waitUntil: "networkidle" });
await partner.getByRole("button", { name: "Sign out" }).click();
await partner.waitForURL(`${BASE}/`, { timeout: 15000 });
await partner.goto(`${BASE}/account`, { waitUntil: "networkidle" });
await partner.getByLabel(/email/i).first().fill(partnerEmail);
await partner.getByLabel(/password/i).first().fill(newPassword);
await partner.getByRole("button", { name: /sign in/i }).last().click();
await partner.waitForURL("**/portal", { timeout: 15000 });
check("new password signs in to the portal", true);
await partner.close();

/* ——— The family sees the confirmation ——— */
const fam2 = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
watchErrors(fam2, errors, "family2");
await fam2.goto(`${BASE}/account`, { waitUntil: "networkidle" });
await fam2.getByLabel(/email/i).first().fill(familyEmail);
await fam2.getByLabel(/password/i).first().fill(pass);
await fam2.getByRole("button", { name: /sign in/i }).last().click();
await fam2.waitForURL("**/account/dashboard", { timeout: 15000 });
const dash = await fam2.locator("main").textContent();
check("family dashboard shows confirmed status", /confirmed/i.test(dash ?? ""));
check("family sees the partner's reply", dash?.includes("consider it done") ?? false);
check("family sees the memorial gift tally", dash?.includes("1 memorial gift") ?? false);
await fam2.close();

await browser.close();
summary(errors);
