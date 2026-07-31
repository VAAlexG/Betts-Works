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
  assert.match(
    response.headers.get("content-security-policy") ?? "",
    /img-src[^;]*https:\/\/cdn\.images\.stock\.i-motor\.net\.au/,
  );
  const html = await response.text();
  assert.match(html, /American trucks\./);
  assert.match(html, /Australian roads\./);
  assert.match(html, /SCD American Vehicles \(SCD\).*specialist right-hand-drive conversion partner/);
  assert.match(html, /Independent Australian vehicle dealer/i);
  assert.match(html, /Right-hand-drive converted/i);
  assert.match(html, /ADR compliant/i);
  assert.match(html, /Sourced to your spec/i);
  assert.match(html, /View current stock/);
  assert.match(html, /Make an enquiry/);
  assert.doesNotMatch(html, /How the specialist pathway works/);
  assert.match(html, /You choose/);
  assert.match(html, /We source &amp; sell/);
  assert.match(html, /SCD converts &amp; complies/);
  assert.match(html, /You drive/);
  assert.match(html, /Customer stories/);
  assert.match(html, /2025 Ford F350 Lariat/i);
  assert.match(html, /\$259,000/);
  assert.match(html, /Engine \/ fuel/);
  assert.match(html, /Transmission/);
  assert.match(html, /Excl\. govt charges &amp; on-road costs\*/);
  assert.match(html, /Unless expressly stated as drive-away/);
  assert.match(html, /\/brand\/betts-works-logo\.png/);
  assert.match(html, /brand-approved-logo/);
  assert.match(html, /American vehicle imports/i);
  assert.match(html, /https:\/\/bettsworks\.com\.au\/og\.png/);
  assert.match(html, /https:\/\/bettsworks\.com\.au\/?/);
  assert.doesNotMatch(html, /localhost/i);
  assert.match(html, /"@type":"AutoDealer"/);
  assert.match(html, /37 195 578 714/);
  assert.match(html, /TODO.*QLD motor dealer licence number/);
  assert.match(html, /By appointment.*contact us to arrange a viewing/);
  assert.doesNotMatch(html, /pending approval|Pending confirmation/i);
  assert.doesNotMatch(html, /href="\/admin"/);
  assert.doesNotMatch(html, /View stock.*↗/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("protects admin indexing and browser surfaces", async () => {
  const response = await fetch(`${origin}/admin`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("strict-transport-security"), "max-age=63072000; includeSubDomains; preload");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.equal(response.headers.get("permissions-policy"), "camera=(), microphone=(), geolocation=()");
  assert.equal(response.headers.get("x-frame-options"), "SAMEORIGIN");
  assert.match(response.headers.get("content-security-policy") ?? "", /object-src 'none'/);
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'self'/);
  assert.match(response.headers.get("content-security-policy") ?? "", /upgrade-insecure-requests/);
  assert.match(await response.text(), /Administrator sign-in required|Protected administration/);
});

test("renders completed privacy and business details without placeholders", async () => {
  const response = await fetch(`${origin}/privacy`);
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /Effective 28 July 2026/);
  assert.match(html, /Privacy Act 1988/);
  assert.match(html, /tyson@bettsworks\.com\.au/);
  assert.match(html, /37 195 578 714/);
  assert.doesNotMatch(html, /\[(?:insert|Insert)/);
});

test("uses production metadata on every public page", async () => {
  const paths = ["/", "/stock", "/about", "/scd-direct", "/faq", "/contact", "/privacy", "/terms", "/vehicles/2025-ford-f450-platinum-0001"];
  for (const path of paths) {
    const response = await fetch(`${origin}${path}`);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.doesNotMatch(html, /localhost/i, path);
    assert.match(html, new RegExp(`https://bettsworks\\.com\\.au${path === "/" ? "/?" : path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), path);
    assert.match(html, /(?:https:\/\/bettsworks\.com\.au\/(?:og\.png|api\/images\/)|https:\/\/cdn\.images\.stock\.i-motor\.net\.au\/)/i, path);
  }
});

test("publishes crawl controls and vehicle structured data", async () => {
  const robots = await (await fetch(`${origin}/robots.txt`)).text();
  assert.match(robots, /Disallow: \/admin/);
  assert.match(robots, /Sitemap: https:\/\/bettsworks\.com\.au\/sitemap\.xml/);
  const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
  assert.match(sitemap, /https:\/\/bettsworks\.com\.au\/stock/);
  assert.match(sitemap, /https:\/\/bettsworks\.com\.au\/vehicles\/2025-ford-f450-platinum-0001/);
  const vehicle = await (await fetch(`${origin}/vehicles/2025-ford-f450-platinum-0001`)).text();
  assert.match(vehicle, /"@type":\["Car","Vehicle"\]/);
  assert.match(vehicle, /"priceCurrency":"AUD"/);
  assert.match(vehicle, /Enlarge photo 1 of \d+/);
  assert.match(vehicle, /aria-haspopup="dialog"/);
  const stock = await (await fetch(`${origin}/stock`)).text();
  assert.match(stock, /Model \/ trim/);
  assert.match(stock, /Minimum price/);
  assert.match(stock, /Maximum price/);
  assert.match(stock, /Showing available stock/);
  assert.doesNotMatch(stock, /Load more vehicles/);
});

test("issues a same-origin CSRF cookie and rejects an unprotected enquiry", async () => {
  const tokenResponse = await fetch(`${origin}/api/enquiries/csrf`);
  assert.equal(tokenResponse.status, 200);
  assert.match(tokenResponse.headers.get("set-cookie") ?? "", /bw_csrf=.*HttpOnly.*SameSite=Strict/i);
  const rejected = await fetch(`${origin}/api/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: "{}",
  });
  assert.equal(rejected.status, 403);
  assert.doesNotMatch(await rejected.text(), /stack|trace|exception/i);
});
