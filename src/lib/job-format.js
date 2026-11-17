// Pure display helpers for job records — safe to use in Server and Client Components.
import { LEVELS, WORK_AUTH } from "@/data/jobs";

export const jobHref = (job) => `/careers/${job.slug}`;

export function levelOf(years) {
  return (LEVELS.find((l) => years >= l.min && years <= l.max) ?? LEVELS[LEVELS.length - 1]).id;
}

export function locationLabel(job) {
  return job.city ? `${job.city}, ${job.region}` : "Remote (US)";
}

export function payLabel({ pay }) {
  if (pay.unit === "yr") return `$${pay.min / 1000}k–${pay.max / 1000}k/yr`;
  return `$${pay.min}–${pay.max}/hr`;
}

// Hourly rates annualized at 2,080 hrs so "Pay: high to low" compares like with like.
export function annualPayMax({ pay }) {
  return pay.unit === "yr" ? pay.max : pay.max * 2080;
}

export function experienceLabel(job) {
  return job.experienceYears === 0 ? "New grad" : `${job.experienceYears}+ yrs`;
}

const AUTH_LABEL = Object.fromEntries(WORK_AUTH.map((a) => [a.code, a.label]));
export const authLabel = (code) => AUTH_LABEL[code] ?? code;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "2026-11-12" → "Nov 12". Parsed by hand so server and client always agree (no timezone shift).
export function shortDate(iso) {
  const [, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}
