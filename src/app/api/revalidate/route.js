// On-demand cache refresh for the careers site. The dashboard calls this after jobs or
// categories change so the public pages update immediately. Protected by a shared secret.
import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

function authorised(req) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = req.headers.get("x-revalidate-secret") ?? "";
  if (!secret || secret.length < 16) return false;
  const a = Buffer.from(secret);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req) {
  if (!authorised(req)) return Response.json({ ok: false }, { status: 401 });
  revalidateTag("jobs", "max");
  return Response.json({ ok: true });
}
