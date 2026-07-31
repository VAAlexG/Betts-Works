/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  VEHICLE_IMAGES: R2Bucket;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const SECURITY_POLICY = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://cdn.images.stock.i-motor.net.au",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
  "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com",
  "frame-src https://challenges.cloudflare.com",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
  "block-all-mixed-content",
].join("; ");

function withSecurityHeaders(response: Response, pathname: string) {
  const secured = new Response(response.body, response);
  secured.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  secured.headers.set("Content-Security-Policy", SECURITY_POLICY);
  secured.headers.set("X-Content-Type-Options", "nosniff");
  secured.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  secured.headers.set("X-Frame-Options", "SAMEORIGIN");
  secured.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  secured.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    secured.headers.set("X-Robots-Tag", "noindex, nofollow");
    secured.headers.set("Cache-Control", "no-store");
  }
  return secured;
}

async function digest(value: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function adminEntryAllowed(request: Request, env: Env) {
  if (request.headers.get("oai-authenticated-user-email")) return true;
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const key = `admin:${await digest(ip)}`;
  const now = Date.now();
  const windowMs = 15 * 60_000;
  const limit = 20;
  try {
    const row = await env.DB.prepare("SELECT window_started_at, count FROM rate_limits WHERE key = ?").bind(key).first<{ window_started_at: number; count: number }>();
    if (!row || now - row.window_started_at > windowMs) {
      await env.DB.prepare("INSERT INTO rate_limits (key, window_started_at, count) VALUES (?, ?, 1) ON CONFLICT(key) DO UPDATE SET window_started_at = excluded.window_started_at, count = 1").bind(key, now).run();
      return true;
    }
    if (row.count >= limit) return false;
    await env.DB.prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?").bind(key).run();
    return true;
  } catch {
    // Authentication remains mandatory even if rate-limit storage is unavailable.
    return true;
  }
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const productionHost = url.hostname === "bettsworks.com.au" || url.hostname === "www.bettsworks.com.au";
    if (productionHost && (url.protocol === "http:" || request.headers.get("x-forwarded-proto") === "http")) {
      url.protocol = "https:";
      return withSecurityHeaders(Response.redirect(url, 308), url.pathname);
    }

    if (url.pathname.startsWith("/api/admin") && !["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      const origin = request.headers.get("origin");
      if (origin !== url.origin) return withSecurityHeaders(new Response("Invalid request.", { status: 403 }), url.pathname);
    }

    if ((url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/admin")) && !(await adminEntryAllowed(request, env))) {
      return withSecurityHeaders(new Response("Too many requests. Please wait and try again.", { status: 429, headers: { "Retry-After": "900" } }), url.pathname);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const imageResponse = await handleImageOptimization(request, {
        fetchAsset: (path) => {
          const source = new URL(path, request.url);
          if (source.hostname === "cdn.images.stock.i-motor.net.au") return fetch(source);
          if (source.origin === url.origin && source.pathname.startsWith("/api/images/")) return handler.fetch(new Request(source, request), env, ctx);
          return env.ASSETS.fetch(new Request(source));
        },
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
      return withSecurityHeaders(imageResponse, url.pathname);
    }

    const response = await handler.fetch(request, env, ctx);
    return withSecurityHeaders(response, url.pathname);
  },
};

export default worker;
