/** The tribute studio produces a real video file in the browser. */
import { ARTIFACTS, BASE, launch, makeChecker, watchErrors } from "./helpers.mjs";

const { check, summary } = makeChecker("tribute");
const errors = [];
const browser = await launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
watchErrors(page, errors, "tribute");

// Fabricate three "family photographs" by screenshotting site pages.
const photos = [];
for (const [i, path] of ["/memorials", "/resources", "/pricing"].entries()) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  const file = `${ARTIFACTS}photo-${i}.png`;
  await page.screenshot({ path: file });
  photos.push(file);
}

await page.goto(`${BASE}/tribute`, { waitUntil: "networkidle" });
await page.getByLabel("Their name", { exact: false }).fill("Eleanor Mae Thompson");
await page.locator('input[type="range"]').fill("3");
await page.locator('input[aria-label="Add photographs"]').setInputFiles(photos);
await page.waitForTimeout(800);
check("three photographs listed", (await page.locator("ul li img").count()) === 3);

await page.getByRole("button", { name: /Create the video/ }).click();
await page.getByText("The tribute is ready").waitFor({ timeout: 90000 });

const video = await page.evaluate(async () => {
  const el = document.querySelector("video");
  if (!el?.src) return { ok: false };
  const blob = await (await fetch(el.src)).blob();
  return { ok: blob.size > 50000, size: blob.size, type: blob.type };
});
check(`video blob generated (${video.size ?? 0} bytes, ${video.type ?? "?"})`, video.ok);

const filename = await page.locator("a[download]").getAttribute("download");
check(
  `download filename derived from name (${filename})`,
  filename === "tribute-eleanor-mae-thompson.webm" || filename === "tribute-eleanor-mae-thompson.mp4",
);

await browser.close();
summary(errors);
