/**
 * v12: funding a farewell with a life-insurance assignment — the second
 * checkout path. Family holds arrangements with nothing due today; the
 * coordinator verifies the policy and marks the order funded.
 */
import { BASE, launch, makeChecker, watchErrors } from "./helpers.mjs";

const { check, summary } = makeChecker("funding");
const errors = [];
const email = `martha.${Date.now()}@example.com`;

const browser = await launch();

/* ——— The family: hold arrangements on a policy ——— */
const family = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
watchErrors(family, errors, "family");

await family.goto(`${BASE}/pricing`, { waitUntil: "networkidle" });
check(
  "pricing promises assignments accepted",
  ((await family.locator("main").textContent()) ?? "").includes(
    "Life insurance assignments accepted",
  ),
);

await family.getByRole("link", { name: /Begin with this package/ }).nth(1).click();
await family.waitForURL("**/checkout?package=*");
await family.getByRole("button", { name: /Use life insurance/ }).click();
await family.getByLabel("Your name").fill("Martha Hayes");
await family.getByLabel("Your email").fill(email);
await family.getByLabel("Insurance company").fill("Shepherd Mutual Life");
await family.getByLabel(/^Policy number/).fill("SM-4451209");
await family.getByLabel("Whose name is the policy in?").fill("Deacon Robert Earl Hayes");
await family.getByLabel(/^Approximate benefit/).fill("15000");
await family.getByRole("button", { name: /Hold arrangements — nothing due today/ }).click();
await family.waitForURL("**/assignment", { timeout: 15000 });

const heldText = (await family.locator("main").textContent()) ?? "";
const orderRef = (heldText.match(/ORD-[A-Z0-9]{6}/) || [""])[0];
check(`assignment order held (${orderRef})`, orderRef.startsWith("ORD-"));
check("nothing is due today", heldText.includes("nothing is due today"));
check("family owes $0", heldText.includes("$0"));
check("policy named on the page", heldText.includes("Shepherd Mutual Life"));

// The demo payment page must never complete an assignment order.
await family.goto(`${BASE}/checkout/${orderRef}`, { waitUntil: "networkidle" });
check(
  "payment page redirects assignments to the held page",
  family.url().includes(`/checkout/${orderRef}/assignment`),
);

/* ——— The coordinator: verify, then mark funded ——— */
const admin = await (await browser.newContext({ viewport: { width: 1440, height: 1100 } })).newPage();
watchErrors(admin, errors, "coordinator");
await admin.goto(`${BASE}/account`, { waitUntil: "networkidle" });
await admin.getByLabel(/email/i).first().fill("coordinator@legacy.example");
await admin
  .getByLabel(/password/i)
  .first()
  .fill(process.env.LEGACY_ADMIN_PASSWORD || "walk-beside-families");
await admin.getByRole("button", { name: /sign in/i }).last().click();
await admin.waitForURL("**/admin", { timeout: 15000 });

const orderCard = admin.locator("div.rounded-2xl").filter({ hasText: orderRef }).first();
const cardText = (await orderCard.textContent()) ?? "";
check("console shows the assignment order", cardText.includes("Shepherd Mutual Life"));
check("console shows the policy number", cardText.includes("SM-4451209"));
check("console shows assignment pending", cardText.includes("Assignment pending"));

await orderCard.locator('select[name="status"]').selectOption("assignment-verified");
await orderCard.getByRole("button", { name: "Update" }).click();
await admin.waitForTimeout(800);
const verifiedCard = admin.locator("div.rounded-2xl").filter({ hasText: orderRef }).first();
check(
  "assignment verified in the console",
  ((await verifiedCard.textContent()) ?? "").includes("Assignment verified"),
);

await verifiedCard.locator('select[name="status"]').selectOption("paid");
await verifiedCard.getByRole("button", { name: "Update" }).click();
await admin.waitForTimeout(800);
const fundedCard = admin.locator("div.rounded-2xl").filter({ hasText: orderRef }).first();
const fundedText = (await fundedCard.textContent()) ?? "";
check("funded order marked paid", fundedText.includes("Paid"));
check("funded order keeps the policy record", fundedText.includes("Shepherd Mutual Life"));

/* ——— The family sees the receipt ——— */
await family.goto(`${BASE}/checkout/${orderRef}/receipt`, { waitUntil: "networkidle" });
check(
  "receipt now serves the family",
  ((await family.locator("main").textContent()) ?? "").includes("Thank you"),
);

await browser.close();
summary(errors);
