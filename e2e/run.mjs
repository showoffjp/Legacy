/**
 * E2E runner: reuses a server already listening on the base URL, or starts
 * `npm run start` itself, then runs every spec sequentially.
 */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const BASE = process.env.E2E_BASE_URL || "http://localhost:3000";
const SPECS = [
  "pages.spec.mjs",
  "plan-program.spec.mjs",
  "tribute.spec.mjs",
  "lifecycle.spec.mjs",
];

async function serverUp() {
  try {
    const res = await fetch(BASE, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

let server = null;
if (await serverUp()) {
  console.log(`Reusing server at ${BASE}`);
} else {
  console.log("Starting production server…");
  server = spawn("npm", ["run", "start"], { stdio: "inherit", detached: true });
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    await delay(1000);
    up = await serverUp();
  }
  if (!up) {
    console.error(`Server did not become ready at ${BASE}`);
    process.exit(1);
  }
}

let failed = false;
for (const spec of SPECS) {
  console.log(`\n━━━ ${spec} ━━━`);
  const code = await new Promise((resolve) => {
    const child = spawn(process.execPath, [new URL(spec, import.meta.url).pathname], {
      stdio: "inherit",
    });
    child.on("exit", (c) => resolve(c ?? 1));
  });
  if (code !== 0) failed = true;
}

if (server?.pid) {
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    // already gone
  }
}
process.exit(failed ? 1 : 0);
