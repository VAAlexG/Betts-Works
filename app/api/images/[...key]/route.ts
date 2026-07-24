import { env } from "cloudflare:workers";
import { getD1 } from "@/db";
import { ensureDatabase } from "@/db/ensure";

export async function GET(_request:Request,{params}:{params:Promise<{key:string[]}>}){
  await ensureDatabase();
  const {key}=await params;const storageKey=key.join("/");
  const allowed=await getD1().prepare("SELECT vi.storage_key FROM vehicle_images vi INNER JOIN vehicles v ON v.id = vi.vehicle_id WHERE vi.storage_key = ? AND v.published = 1 AND v.archived_at IS NULL").bind(storageKey).first();
  if(!allowed)return new Response("Not found",{status:404});
  const bucket=(env as unknown as {VEHICLE_IMAGES?:R2Bucket}).VEHICLE_IMAGES;if(!bucket)return new Response("Storage unavailable",{status:503});
  const object=await bucket.get(storageKey);if(!object)return new Response("Not found",{status:404});
  const headers=new Headers();object.writeHttpMetadata(headers);headers.set("etag",object.httpEtag);headers.set("cache-control","public, max-age=86400, stale-while-revalidate=604800");headers.set("x-content-type-options","nosniff");
  return new Response(object.body,{headers});
}
