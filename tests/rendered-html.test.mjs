import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { after, before, test } from "node:test";

const port = 3456;
const origin = `http://localhost:${port}`;
let server;
let serverOutput = "";

before(async () => {
  server = spawn(`npm run dev -- --port ${port}`, { cwd: new URL("../", import.meta.url), shell: true, env: { ...process.env, WRANGLER_LOG_PATH: ".wrangler/test.log" } });
  server.stdout.on("data", (chunk) => { serverOutput += chunk; });
  server.stderr.on("data", (chunk) => { serverOutput += chunk; });
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try { const response = await fetch(`${origin}/about`); if (response.ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Production preview did not start. ${serverOutput.slice(-1000)}`);
});

after(() => {
  if (!server?.pid) return;
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore" });
  else server.kill("SIGTERM");
});

test("server-renders the finished Betts Works homepage", async () => {
  const response = await fetch(origin);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /American trucks\./);
  assert.match(html, /Australian roads\./);
  assert.match(html, /SCD Direct/);
  assert.match(html, /Independent Australian vehicle dealer/i);
  assert.match(html, /Exact SCD Direct stock/i);
  assert.match(html, /2025 Ford F350 Lariat/i);
  assert.match(html, /\$259,000/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("protects admin indexing and browser surfaces", async () => {
  const response = await fetch(`${origin}/admin`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("content-security-policy") ?? "", /object-src 'none'/);
  assert.match(await response.text(), /Administrator sign-in required|Protected administration/);
});

test("renders legal drafts as unapproved", async () => {
  const response = await fetch(`${origin}/privacy`);
  const html = await response.text();
  assert.match(html, /Draft for business\/legal review/);
  assert.match(html, /Privacy contact details are pending business approval/);
});
