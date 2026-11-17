// Careers data access. Every page and the drawer read jobs only through these functions.
// They now read live PUBLISHED jobs from Supabase; the returned shape is unchanged (camelCase).
// Results are cached under the "jobs" tag — call revalidateTag("jobs") after jobs change
// (e.g. from a Supabase webhook) to refresh the cached pages.
import { cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

// DB row (snake_case) -> the camelCase shape the careers UI expects.
function fromRow(r) {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    experienceYears: r.experience_years ?? 0,
    city: r.city ?? null,
    region: r.region ?? null,
    workplace: r.workplace,
    engagement: r.engagement ?? [],
    pay: { min: r.pay_min ?? null, max: r.pay_max ?? null, unit: r.pay_unit ?? "hr" },
    duration: r.duration ?? "",
    workAuth: r.work_auth ?? [],
    postedAt: r.posted_at,
    skills: r.skills ?? [],
    summary: r.summary ?? "",
    responsibilities: r.responsibilities ?? [],
    requirements: r.requirements ?? [],
    niceToHave: r.nice_to_have ?? [],
  };
}

export async function getJobs() {
  "use cache";
  cacheTag("jobs");
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .order("posted_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(fromRow);
}

export async function getJobBySlug(slug) {
  "use cache";
  cacheTag("jobs");
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : null;
}

// Same category first, then roles sharing the most skills.
export async function getSimilarJobs(slug, limit = 3) {
  "use cache";
  cacheTag("jobs");
  const all = await getJobs();
  const job = all.find((j) => j.slug === slug);
  if (!job) return [];
  const score = (other) =>
    (other.category === job.category ? 10 : 0) + other.skills.filter((s) => job.skills.includes(s)).length;
  return all
    .filter((j) => j.slug !== slug)
    .map((j) => [score(j), j])
    .filter(([s]) => s > 0)
    .sort((a, b) => b[0] - a[0])
    .slice(0, limit)
    .map(([, j]) => j);
}
