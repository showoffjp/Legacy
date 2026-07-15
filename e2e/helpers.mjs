import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

export const BASE = process.env.E2E_BASE_URL || "http://localhost:3000";

export const ARTIFACTS = new URL("./.artifacts/", import.meta.url).pathname;
mkdirSync(ARTIFACTS, { recursive: true });

/** Launch Chromium — honors CHROMIUM_PATH for preinstalled browsers. */
export function launch() {
  return chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ["--autoplay-policy=no-user-gesture-required", "--mute-audio"],
  });
}

/** Simple PASS/FAIL tracker; call summary() at the end to set the exit code. */
export function makeChecker(specName) {
  let failures = 0;
  return {
    check(label, ok) {
      console.log(`${ok ? "PASS" : "FAIL"}: ${label}`);
      if (!ok) failures += 1;
    },
    summary(pageErrors = []) {
      if (pageErrors.length > 0) {
        failures += pageErrors.length;
        console.log(`PAGE ERRORS:\n${pageErrors.join("\n")}`);
      }
      console.log(
        failures === 0 ? `${specName}: ALL CHECKS PASSED` : `${specName}: ${failures} FAILED`,
      );
      process.exit(failures === 0 ? 0 : 1);
    },
  };
}

/** Collect page errors and console errors (with source URL) onto the given array. */
export function watchErrors(page, sink, label) {
  page.on("pageerror", (e) => sink.push(`${label} pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") {
      const where = m.location()?.url ? ` [${m.location().url}]` : "";
      sink.push(`${label} console: ${m.text()}${where}`);
    }
  });
}
