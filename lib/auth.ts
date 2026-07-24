import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { adminUsers } from "@/db/schema";
import { getDb } from "@/db";
import { ensureDatabase } from "@/db/ensure";

export type AdminPrincipal = { id: string; email: string; role: "owner" | "editor" };

function runtimeValue(name: string) {
  const binding = (env as unknown as Record<string, unknown>)[name];
  return typeof binding === "string" ? binding : process.env[name];
}

export async function getAdminPrincipal(): Promise<AdminPrincipal | null> {
  const user = await getChatGPTUser();
  const devEmail = process.env.NODE_ENV !== "production" ? runtimeValue("DEV_ADMIN_EMAIL") : undefined;
  const email = (user?.email || devEmail || "").trim().toLowerCase();
  if (!email) return null;
  const allowlist = (runtimeValue("ADMIN_EMAILS") || devEmail || "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  if (!allowlist.includes(email)) return null;
  await ensureDatabase();
  const db = getDb();
  let admin = await db.query.adminUsers.findFirst({ where: eq(adminUsers.email, email) });
  if (!admin) {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    await db.insert(adminUsers).values({ id, email, externalAuthId: email, role: "owner", active: true, createdAt: now, updatedAt: now });
    admin = await db.query.adminUsers.findFirst({ where: eq(adminUsers.id, id) });
  }
  if (!admin?.active || !["owner", "editor"].includes(admin.role)) return null;
  return { id: admin.id, email: admin.email, role: admin.role as "owner" | "editor" };
}

export async function requireAdminApi() {
  const principal = await getAdminPrincipal();
  if (!principal) return null;
  return principal;
}
