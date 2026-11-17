"use server";

// Application submission, as two Server Actions (the browser never writes to the DB itself):
//   1. startApplication  — honeypot + Cloudflare Turnstile check, validates the résumé's name/size,
//      then hands back a one-time signed upload URL into the PRIVATE `resumes` bucket. The file
//      goes browser -> Supabase directly, so a 5 MB résumé never passes through a Vercel function
//      (which caps request bodies at ~4.5 MB).
//   2. finishApplication — re-validates the fields, checks the résumé really was uploaded under a
//      path we issued, rate-limits per email, then inserts the row with the service-role key.
// Anonymous insert policies were removed in migration 0004, so this is the only way in.
//
// Turnstile is enforced only when TURNSTILE_SECRET_KEY is set (skipped in local dev).
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_BYTES = 5 * 1024 * 1024;
const RESUME_TYPES = /\.(pdf|docx?)$/i;
const PATH_RE = /^[0-9a-f-]{36}\/[\w.-]{1,120}$/i;
const MAX_PER_EMAIL_PER_DAY = 3;
const GENERIC_ERROR = "Something went wrong sending your application. Please try again.";

const text = (fd, key, max = 500) => String(fd.get(key) ?? "").trim().slice(0, max);

async function verifyTurnstile(token) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured (local dev)
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
    });
    const json = await res.json();
    return json.success === true;
  } catch {
    return false;
  }
}

// Step 1. Input: { fileName, fileSize, turnstileToken, honeypot }.
// Output: { ok: true, path, token } | { ok: false, error } | { ok: true, bot: true }.
export async function startApplication({ fileName, fileSize, turnstileToken, honeypot }) {
  if (honeypot) return { ok: true, bot: true }; // bot — pretend success
  if (typeof fileName !== "string" || !RESUME_TYPES.test(fileName)) return { ok: false, error: "Attach a PDF or Word résumé." };
  if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > MAX_BYTES) return { ok: false, error: "Your résumé is over 5 MB." };
  if (!(await verifyTurnstile(turnstileToken))) return { ok: false, error: "Verification failed. Please refresh and try again." };

  const safeName = fileName.replace(/[^\w.-]+/g, "_").slice(-120);
  const path = `${crypto.randomUUID()}/${safeName}`;
  const { data, error } = await createAdminClient().storage.from("resumes").createSignedUploadUrl(path);
  if (error || !data) return { ok: false, error: GENERIC_ERROR };
  return { ok: true, path: data.path, token: data.token };
}

// Step 2. Input: FormData with the form fields plus `resumePath` and `resumeName`.
// Output: { ok: true } | { ok: false, error }.
export async function finishApplication(formData) {
  const path = text(formData, "resumePath", 200);
  if (!PATH_RE.test(path)) return { ok: false, error: GENERIC_ERROR };

  const name = text(formData, "name", 120);
  const email = text(formData, "email", 200).toLowerCase();
  const phone = text(formData, "phone", 40);
  const auth = text(formData, "auth", 60);
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || phone.replace(/\D/g, "").length < 10 || !auth) {
    return { ok: false, error: "Please check your details and try again." };
  }

  const supabase = createAdminClient();

  // The résumé must actually exist under the path we issued.
  const [folder, file] = path.split("/");
  const { data: objects } = await supabase.storage.from("resumes").list(folder, { limit: 5 });
  if (!objects?.some((o) => o.name === file)) return { ok: false, error: GENERIC_ERROR };

  // Per-email rate limit (Turnstile already gates bots; this stops one address flooding the inbox).
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", since);
  if ((count ?? 0) >= MAX_PER_EMAIL_PER_DAY) {
    return { ok: false, error: "You've applied a few times today already. Please try again tomorrow." };
  }

  const years = parseInt(text(formData, "years", 3), 10);
  const taxTerm = text(formData, "taxTerm", 30);
  const { error } = await supabase.from("applications").insert({
    job_id: text(formData, "jobId", 100) || null,
    name,
    email,
    phone,
    work_auth: auth,
    location: text(formData, "location", 120) || null,
    years_experience: Number.isFinite(years) && years >= 0 && years <= 60 ? years : null,
    tax_term: taxTerm && taxTerm !== "Any" ? taxTerm : null,
    link: text(formData, "link", 300) || null,
    note: text(formData, "note", 2000) || null,
    resume_path: path,
    resume_name: text(formData, "resumeName", 200) || file,
  });
  if (error) return { ok: false, error: GENERIC_ERROR };
  return { ok: true };
}
