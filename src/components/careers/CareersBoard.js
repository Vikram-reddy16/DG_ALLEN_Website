"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import JobCard from "@/components/careers/JobCard";
import FilterRail from "@/components/careers/FilterRail";
import { useAppliedJobs } from "@/components/careers/useAppliedJobs";
import { LEVELS, WORKPLACES, ENGAGEMENTS, WORK_AUTH } from "@/data/jobs";
import { annualPayMax, authLabel, levelOf, locationLabel } from "@/lib/job-format";

const EMPTY = { q: "", category: "All", level: "", workplace: [], engagement: [], auth: "" };
const POOL_AFTER = 6; // show the talent-network banner after this many cards

function matches(job, f, ignore) {
  if (ignore !== "q" && f.q) {
    const hay = [job.title, job.category, locationLabel(job), job.workplace, ...job.skills, ...job.engagement]
      .join(" ")
      .toLowerCase();
    if (!f.q.toLowerCase().split(/\s+/).every((t) => hay.includes(t))) return false;
  }
  if (ignore !== "category" && f.category !== "All" && job.category !== f.category) return false;
  if (ignore !== "level" && f.level && levelOf(job.experienceYears) !== f.level) return false;
  if (ignore !== "workplace" && f.workplace.length && !f.workplace.includes(job.workplace)) return false;
  if (ignore !== "engagement" && f.engagement.length && !f.engagement.some((e) => job.engagement.includes(e))) return false;
  if (ignore !== "auth" && f.auth && !job.workAuth.includes(f.auth)) return false;
  return true;
}

const SORTS = {
  new: (a, b) => b.postedAt.localeCompare(a.postedAt),
  pay: (a, b) => annualPayMax(b) - annualPayMax(a),
  exp: (a, b) => a.experienceYears - b.experienceYears,
};

export default function CareersBoard({ jobs }) {
  const [filters, setFilters] = useState(EMPTY);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("new");
  const [sheetOpen, setSheetOpen] = useState(false);
  const applied = useAppliedJobs();
  const resultsRef = useRef(null);
  const sheetRef = useRef(null);

  // Typing stays responsive; filtering catches up.
  const deferredQ = useDeferredValue(query.trim());
  const f = useMemo(() => ({ ...filters, q: deferredQ }), [filters, deferredQ]);
  const update = (patch) => setFilters((prev) => ({ ...prev, ...patch }));
  const clearAll = () => {
    setFilters(EMPTY);
    setQuery("");
  };

  const categories = useMemo(() => {
    const byCat = new Map();
    jobs.forEach((j) => byCat.set(j.category, (byCat.get(j.category) ?? 0) + 1));
    return [["All", jobs.length], ...byCat];
  }, [jobs]);

  const results = useMemo(() => jobs.filter((j) => matches(j, f)).sort(SORTS[sort]), [jobs, f, sort]);

  const counts = useMemo(() => {
    const pool = (key) => jobs.filter((j) => matches(j, f, key));
    const lvl = pool("level");
    const wp = pool("workplace");
    const eng = pool("engagement");
    const au = pool("auth");
    return {
      level: { any: lvl.length, ...Object.fromEntries(LEVELS.map((l) => [l.id, lvl.filter((j) => levelOf(j.experienceYears) === l.id).length])) },
      workplace: Object.fromEntries(WORKPLACES.map((w) => [w, wp.filter((j) => j.workplace === w).length])),
      engagement: Object.fromEntries(ENGAGEMENTS.map((e) => [e, eng.filter((j) => j.engagement.includes(e)).length])),
      auth: { any: au.length, ...Object.fromEntries(WORK_AUTH.map((a) => [a.code, au.filter((j) => j.workAuth.includes(a.code)).length])) },
    };
  }, [jobs, f]);

  const active = [
    filters.category !== "All" && { key: "category", label: filters.category, clear: () => update({ category: "All" }) },
    filters.level && { key: "level", label: LEVELS.find((l) => l.id === filters.level).label, clear: () => update({ level: "" }) },
    ...filters.workplace.map((w) => ({ key: `wp-${w}`, label: w, clear: () => update({ workplace: filters.workplace.filter((x) => x !== w) }) })),
    ...filters.engagement.map((e) => ({ key: `eng-${e}`, label: e, clear: () => update({ engagement: filters.engagement.filter((x) => x !== e) }) })),
    filters.auth && { key: "auth", label: `Accepts ${authLabel(filters.auth)}`, clear: () => update({ auth: "" }) },
    query.trim() && { key: "q", label: `“${query.trim()}”`, clear: () => setQuery("") },
  ].filter(Boolean);

  // Mobile filter sheet: modal while open.
  useEffect(() => {
    if (!sheetOpen) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    sheetRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setSheetOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  // Close the sheet if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 921px)");
    const onMq = () => mq.matches && setSheetOpen(false);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  function onSearch(e) {
    e.preventDefault();
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const listed = results.length > POOL_AFTER ? [results.slice(0, POOL_AFTER), results.slice(POOL_AFTER)] : [results, []];

  return (
    <>
      <section className="cr-hero">
        <div className="shell">
          <p className="kick">Careers · DG-ALLEN</p>
          <h1>Find your next IT role.</h1>
          <p className="lead">
            Contract and full-time roles with our US clients — on W2, C2C or 1099. Any stack, any experience level. Read
            the full post and apply in about two minutes.
          </p>

          <form className="cr-search" role="search" onSubmit={onSearch}>
            <div className="cr-search-q">
              <Icon name="search" strokeWidth={2} />
              <label htmlFor="cr-q" className="sr-only">
                Search roles
              </label>
              <input
                id="cr-q"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, skill or city — e.g. Java, Remote, Dallas"
                autoComplete="off"
              />
            </div>
            <label htmlFor="cr-auth" className="sr-only">
              Your work authorization
            </label>
            <select id="cr-auth" className="cr-search-auth" value={filters.auth} onChange={(e) => update({ auth: e.target.value })}>
              <option value="">Any work authorization</option>
              {WORK_AUTH.map((a) => (
                <option key={a.code} value={a.code}>
                  I’m on {a.label}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-red cr-search-btn">
              <span>Search</span>
              <Icon name="arrowRight" strokeWidth={2.2} />
            </button>
          </form>

          <ul className="cr-hero-meta">
            <li>
              <b className="mono">{jobs.length}</b> open roles
            </li>
            <li>
              <span className="mono">W2 · C2C · 1099 · Full-time</span>
            </li>
            <li>
              <Icon name="shieldCheck" strokeWidth={2} /> Never a fee for candidates
            </li>
          </ul>
        </div>
      </section>

      <div className="cr-catbar">
        <div className="shell">
          <div className="cr-catbar-in" role="group" aria-label="Job categories">
            {categories.map(([c, n]) => (
              <button key={c} type="button" className="cr-chip" aria-pressed={filters.category === c} onClick={() => update({ category: c })}>
                {c}
                <span className="cr-chip-n">{n}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="shell">
        <div className="cr-layout">
          {sheetOpen && <div className="cr-sheet-scrim" onClick={() => setSheetOpen(false)} aria-hidden="true" />}
          <aside
            className={`cr-rail${sheetOpen ? " open" : ""}`}
            aria-label="Filters"
            ref={sheetRef}
            tabIndex={sheetOpen ? -1 : undefined}
            role={sheetOpen ? "dialog" : undefined}
            aria-modal={sheetOpen || undefined}
          >
            <div className="cr-sheet-bar">
              <strong>Filters</strong>
              <button type="button" className="btn btn-red btn-sm" onClick={() => setSheetOpen(false)}>
                Show {results.length} {results.length === 1 ? "role" : "roles"}
              </button>
            </div>
            <FilterRail filters={filters} counts={counts} onChange={update} onClear={clearAll} />
          </aside>

          <main className="cr-results" ref={resultsRef} inert={sheetOpen || undefined}>
            <div className="cr-results-head">
              <p className="cr-rcount" aria-live="polite">
                <b className="mono">{results.length}</b> of {jobs.length} roles
              </p>
              <div className="cr-results-tools">
                <button type="button" className="cr-mfilter" onClick={() => setSheetOpen(true)}>
                  <Icon name="sliders" strokeWidth={2} />
                  Filters
                  {active.length > 0 && <span className="cr-mfilter-n">{active.length}</span>}
                </button>
                <label className="cr-sort">
                  <span>Sort</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="new">Newest</option>
                    <option value="pay">Pay: high to low</option>
                    <option value="exp">Experience: low to high</option>
                  </select>
                </label>
              </div>
            </div>

            {active.length > 0 && (
              <ul className="cr-active" aria-label="Active filters">
                {active.map((a) => (
                  <li key={a.key} className="cr-achip">
                    {a.label}
                    <button type="button" onClick={a.clear} aria-label={`Remove filter: ${a.label}`}>
                      <Icon name="close" strokeWidth={2.4} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {results.length === 0 ? (
              <div className="cr-empty">
                <h3>No roles match those filters</h3>
                <p>Try removing a filter — or send your résumé and we’ll reach out when a match opens up.</p>
                <div className="cr-empty-cta">
                  <button type="button" className="btn btn-red" onClick={clearAll}>
                    Clear filters
                  </button>
                  <Link className="btn btn-ghost btn-sm" href="/careers/join" scroll={false}>
                    Submit résumé
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <ul className="cr-jobs">
                  {listed[0].map((j) => (
                    <li key={j.id}>
                      <JobCard job={j} applied={applied.has(j.id)} />
                    </li>
                  ))}
                </ul>
                <PoolBanner />
                {listed[1].length > 0 && (
                  <ul className="cr-jobs cr-jobs--rest">
                    {listed[1].map((j) => (
                      <li key={j.id}>
                        <JobCard job={j} applied={applied.has(j.id)} />
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

function PoolBanner() {
  return (
    <aside className="cr-pool" aria-label="Talent network">
      <div className="cr-pool-txt">
        <h3>Don’t see the right fit?</h3>
        <p>New roles land every week. Send your résumé once and we’ll match you to openings as they come in.</p>
      </div>
      <Link className="btn btn-red" href="/careers/join" scroll={false}>
        Submit your résumé
      </Link>
    </aside>
  );
}
