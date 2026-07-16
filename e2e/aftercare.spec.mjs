/**
 * v10 aftercare: the estate path checklist, the notification-letter
 * builder, the grief year (opt-in → dashboard → end → dispatch), and
 * veteran honors + livestream link flowing from the wizard into the
 * program and the published memorial.
 */
import { BASE, launch, makeChecker, watchErrors } from "./helpers.mjs";

const { check, summary } = makeChecker("aftercare");
const errors = [];
const email = `martha.${Date.now()}@example.com`;
const pass = "still-waters-46";

const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
watchErrors(page, errors, "aftercare");

/* ——— The estate path ——— */
await page.goto(`${BASE}/aftercare`, { waitUntil: "networkidle" });
const heroText = await page.locator("main").textContent();
check("aftercare page greets gently", heroText?.includes("The long walk afterward") ?? false);
check("estate path present", heroText?.includes("The Estate Path") ?? false);

const estate = page.locator("#estate-path");
check(
  "estate progress starts at zero",
  ((await estate.textContent()) ?? "").includes("0") &&
    ((await estate.textContent()) ?? "").includes("matters settled"),
);
await estate.locator('input[type="checkbox"]').first().check();
await page.waitForTimeout(300);
check(
  "checking a matter advances progress",
  ((await estate.locator("p[aria-live]").textContent()) ?? "").startsWith("1"),
);
await page.reload({ waitUntil: "networkidle" });
check(
  "estate progress survives a reload",
  ((await page.locator("#estate-path p[aria-live]").textContent()) ?? "").startsWith("1"),
);

/* ——— Notification letters ——— */
await page.getByLabel("Your full name").fill("Martha Cole");
await page.getByLabel(/^Your mailing address/).fill("412 Chestnut Lane\nNashville, TN 37203");
await page.getByLabel("Their full legal name").fill("Deacon Robert Earl Hayes");
await page.getByLabel("Date of passing").fill("2026-07-01");
await page.getByLabel("Institution name").first().fill("First National Bank");
await page.getByLabel("Account reference (optional)").first().fill("Account ending 4412");
await page.getByRole("button", { name: "Add the three credit bureaus" }).click();
await page.waitForTimeout(300);

const letters = page.locator("article.print-page");
check("four letters composed (bank + three bureaus)", (await letters.count()) === 4);
const bankLetter = (await letters.first().textContent()) ?? "";
check(
  "bank letter carries the sad news",
  bankLetter.includes("I write to inform you that Deacon Robert Earl Hayes passed away on July 1, 2026"),
);
check("bank letter references the account", bankLetter.includes("Account ending 4412"));
check("bank letter signed by the executor", bankLetter.includes("Executor of the estate"));
const lastLetter = (await letters.last().textContent()) ?? "";
check(
  "bureau letter asks for the deceased flag",
  lastLetter.includes("do not issue credit"),
);
check(
  "print button counts the letters",
  await page.getByRole("button", { name: /Print all 4 letters/ }).isEnabled(),
);

/* ——— An account for the grief year ——— */
await page.goto(`${BASE}/account`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Create an account/i }).first().click();
await page.getByLabel(/name/i).first().fill("Martha Cole");
await page.getByLabel(/email/i).first().fill(email);
await page.getByLabel(/password/i).first().fill(pass);
await page.getByRole("button", { name: /create|begin|sign up/i }).last().click();
await page.waitForURL("**/account/dashboard", { timeout: 15000 });

/* ——— The grief year: opt in ——— */
const twentyDaysAgo = new Date(Date.now() - 20 * 86_400_000).toISOString().slice(0, 10);
await page.goto(`${BASE}/aftercare`, { waitUntil: "networkidle" });
await page.getByLabel("Your first name").fill("Martha");
await page.getByLabel("Your email").fill(email);
await page.getByLabel("Your loved one's name").fill("Robert");
await page.getByLabel("The day they passed").fill(twentyDaysAgo);
await page.getByRole("button", { name: "Walk the year with me" }).click();
await page.getByText("We will walk this year with you").waitFor({ timeout: 15000 });
const scheduleText = await page.locator("#grief-year").textContent();
check("schedule promises the one-month note", scheduleText?.includes("One month") ?? false);
check("schedule promises the first anniversary", scheduleText?.includes("One year") ?? false);

/* ——— The grief year on the dashboard ——— */
await page.goto(`${BASE}/account/dashboard`, { waitUntil: "networkidle" });
const dashText = await page.locator("main").textContent();
check("dashboard walks the year for Robert", dashText?.includes("Walking the year for Robert") ?? false);
check("dashboard shows the next note", /next: one month/i.test(dashText ?? ""));

/* ——— Dispatch endpoint (the daily cron's door) ——— */
const dispatch = await page.request.post(`${BASE}/api/remembrances/dispatch`);
check("dispatch endpoint answers", dispatch.ok());
const dispatchBody = await dispatch.json();
check(
  "dispatch reports a count",
  dispatchBody.ok === true && typeof dispatchBody.sent === "number",
);

/* ——— Ending the notes ——— */
await page.getByRole("button", { name: "End the notes" }).click();
await page
  .getByText("Walking the year for Robert")
  .waitFor({ state: "detached", timeout: 15000 });
check("ended notes leave the dashboard", true);

/* ——— Veteran honors + livestream in the plan ——— */
await page.goto(`${BASE}/plan`, { waitUntil: "networkidle" });
await page.getByLabel("Full name").fill("Sgt. Samuel Ray Cole");
await page.getByRole("checkbox", { name: /served in the armed forces/ }).check();
await page.getByLabel("Branch of service").selectOption("U.S. Army");

await page.getByRole("button", { name: "The Service", exact: true }).click();
await page.getByRole("button", { name: /Traditional Burial/ }).click();
await page.getByLabel("Service date").fill("2026-08-15");
await page.getByLabel("State").selectOption("TN");
await page.getByLabel("City").fill("Franklin");
await page.getByRole("checkbox", { name: /Livestream for far-away family/ }).check();
await page.getByLabel(/^Livestream link/).fill("https://youtube.com/live/e2e-legacy");

await page.getByRole("button", { name: "Review", exact: true }).click();
const review = await page.locator("main").textContent();
check("review shows veteran honors", review?.includes("Veteran honors") ?? false);
check("review shows the branch", review?.includes("U.S. Army") ?? false);

/* ——— …flowing into the printed program ——— */
await page.goto(`${BASE}/plan/program`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const program = await page.locator("main").textContent();
check("program cover honors the veteran", program?.includes("U.S. Army Veteran") ?? false);
check("program lists military honors", program?.includes("Military Honors") ?? false);
check(
  "program carries the livestream link",
  program?.includes("https://youtube.com/live/e2e-legacy") ?? false,
);

/* ——— …and onto the published memorial ——— */
await page.goto(`${BASE}/plan`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Review", exact: true }).click();
await page.getByRole("button", { name: /Publish their memorial page/ }).click();
const memorialLink = page.getByRole("link", { name: /Visit their memorial page/ });
await memorialLink.waitFor({ timeout: 15000 });
const memorialHref = await memorialLink.getAttribute("href");
await page.goto(`${BASE}${memorialHref}`, { waitUntil: "networkidle" });
const memorialText = await page.locator("main").textContent();
check("memorial honors the veteran", memorialText?.includes("U.S. Army Veteran") ?? false);
const joinLink = page.getByRole("link", { name: /Join the service online/ });
check(
  "memorial offers the livestream",
  (await joinLink.getAttribute("href")) === "https://youtube.com/live/e2e-legacy",
);

await browser.close();
summary(errors);
