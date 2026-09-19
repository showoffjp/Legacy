/**
 * v14 — the memorial page, deepened:
 *  - the livestream link becomes an embedded player (YouTube/Vimeo)
 *  - a recording added afterward gains a "service, held again" section
 *  - the family chooses the page's address; the guestbook travels with it
 *    and links shared earlier keep resolving
 *  - the console connects an unowned memorial to a family account
 */
import { BASE, launch, makeChecker, watchErrors } from "./helpers.mjs";

const { check, summary } = makeChecker("memorial-address");
const errors = [];
const email = `vera.family.${Date.now()}@example.com`;
const pass = "still-waters-77";

const browser = await launch();

/* ——— The family: account + a memorial with a livestream ——— */
const familyCtx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const family = await familyCtx.newPage();
watchErrors(family, errors, "family");

await family.goto(`${BASE}/account`, { waitUntil: "networkidle" });
await family.getByRole("button", { name: /Create an account/i }).first().click();
await family.getByLabel(/name/i).first().fill("Dorothy Caldwell");
await family.getByLabel(/email/i).first().fill(email);
await family.getByLabel(/password/i).first().fill(pass);
await family.getByRole("button", { name: /create|begin|sign up/i }).last().click();
await family.waitForURL("**/account/dashboard", { timeout: 15000 });

const publishRes = await family.request.post(`${BASE}/api/memorial`, {
  data: {
    plan: {
      deceased: {
        fullName: "Vera Mae Caldwell",
        lifeStory: "She kept the church nursery for three generations of babies.",
        survivedBy: "Her daughter Dorothy and four grandchildren.",
      },
      service: {
        kind: "memorial-service",
        date: "2026-08-20",
        time: "11:00",
        venueName: "Grace Chapel",
        livestream: true,
        livestreamUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        location: { city: "Franklin", state: "TN" },
      },
    },
  },
});
const { slug } = await publishRes.json();
check(`memorial published (${slug})`, typeof slug === "string" && slug.length > 2);

await family.goto(`${BASE}/memorials/${slug}`, { waitUntil: "networkidle" });
const livePlayer = family.locator('iframe[src*="youtube-nocookie.com/embed/dQw4w9WgXcQ"]');
check("livestream plays embedded on the page", (await livePlayer.count()) === 1);

// A word of comfort — it must survive the address change later.
await family.request.post(`${BASE}/api/memorials/${slug}/condolences`, {
  data: {
    name: "Nadine Porter",
    message: "She sang beside me in the alto section for thirty years.",
  },
});

/* ——— The recording, added after the day ——— */
await family.goto(`${BASE}/account/memorials/${slug}`, { waitUntil: "networkidle" });
await family.getByLabel(/Recording of the service/i).fill("https://vimeo.com/76979871");
await family.getByRole("button", { name: /Save the memorial/i }).click();
await family.getByText(/Saved — the memorial page reflects/i).waitFor({ timeout: 15000 });

await family.goto(`${BASE}/memorials/${slug}`, { waitUntil: "networkidle" });
const pageText = (await family.locator("main").textContent()) ?? "";
check("recording section appears", pageText.includes("The Service, Held Again"));
check(
  "recording plays embedded",
  (await family.locator('iframe[src*="player.vimeo.com/video/76979871"]').count()) === 1,
);

/* ——— Choosing the page's address ——— */
const chosen = "vera-caldwell-homegoing";
await family.goto(`${BASE}/account/memorials/${slug}`, { waitUntil: "networkidle" });
await family.getByLabel("Page address").fill(chosen);
await family.getByRole("button", { name: /Change the address/i }).click();
await family.waitForURL(`**/account/memorials/${chosen}`, { timeout: 15000 });
check("manage page follows the new address", true);

await family.goto(`${BASE}/memorials/${chosen}`, { waitUntil: "networkidle" });
const movedText = (await family.locator("main").textContent()) ?? "";
check("page lives at the chosen address", movedText.includes("Vera Mae Caldwell"));
check("guestbook traveled with the page", movedText.includes("alto section"));

await family.goto(`${BASE}/memorials/${slug}`, { waitUntil: "networkidle" });
check(
  "the old shared link follows the page",
  family.url().includes(`/memorials/${chosen}`) &&
    ((await family.locator("main").textContent()) ?? "").includes("Vera Mae Caldwell"),
);

/* ——— A neighbor publishes without an account; the console connects it ——— */
const guestCtx = await browser.newContext();
const guest = await guestCtx.newPage();
const guestPublish = await guest.request.post(`${BASE}/api/memorial`, {
  data: { plan: { deceased: { fullName: "Harold James Whitfield" } } },
});
const { slug: orphanSlug } = await guestPublish.json();
check(`unowned memorial published (${orphanSlug})`, typeof orphanSlug === "string");
await guestCtx.close();

const adminCtx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const admin = await adminCtx.newPage();
watchErrors(admin, errors, "admin");
await admin.goto(`${BASE}/account`, { waitUntil: "networkidle" });
await admin.getByLabel(/email/i).first().fill("coordinator@legacy.example");
await admin.getByLabel(/password/i).first().fill("walk-beside-families");
await admin.getByRole("button", { name: /sign in/i }).last().click();
await admin.waitForURL("**/admin", { timeout: 15000 });

await admin.getByLabel(`Family account email for ${orphanSlug}`).fill(email);
await admin
  .locator(`form:has(input[value="${orphanSlug}"])`)
  .getByRole("button", { name: /^Connect/ })
  .click();
await admin.getByText(`Managed by the family at ${email}`).waitFor({ timeout: 15000 });
check("console connects the page to the family", true);

await family.goto(`${BASE}/account/dashboard`, { waitUntil: "networkidle" });
check(
  "connected memorial reaches the family dashboard",
  ((await family.locator("main").textContent()) ?? "").includes("Harold James Whitfield"),
);

/* ——— A taken address is refused gently ——— */
await family.goto(`${BASE}/account/memorials/${orphanSlug}`, { waitUntil: "networkidle" });
await family.getByLabel("Page address").fill(chosen);
await family.getByRole("button", { name: /Change the address/i }).click();
await family.getByText(/already in use/i).waitFor({ timeout: 15000 });
check("a taken address is refused", true);

check("no page errors", errors.length === 0, errors.join(" | "));

await browser.close();
summary();
