const CSRF_COOKIE = "bw_csrf";
const TOKEN_BYTES = 32;

function parseCookies(header: string | null) {
  const values = new Map<string, string>();
  for (const entry of (header || "").split(";")) {
    const separator = entry.indexOf("=");
    if (separator < 1) continue;
    values.set(entry.slice(0, separator).trim(), decodeURIComponent(entry.slice(separator + 1).trim()));
  }
  return values;
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export function issueCsrfToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(TOKEN_BYTES));
  return [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
}

export function csrfCookie(token: string) {
  return `${CSRF_COOKIE}=${encodeURIComponent(token)}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=1800`;
}

export function verifyCsrf(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (origin !== requestUrl.origin) return false;
  if (fetchSite && fetchSite !== "same-origin") return false;

  const supplied = request.headers.get("x-csrf-token") || "";
  const cookie = parseCookies(request.headers.get("cookie")).get(CSRF_COOKIE) || "";
  return supplied.length === TOKEN_BYTES * 2 && constantTimeEqual(supplied, cookie);
}
