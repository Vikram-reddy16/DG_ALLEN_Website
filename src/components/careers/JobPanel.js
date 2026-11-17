"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import JobDetail from "@/components/careers/JobDetail";
import ApplyForm from "@/components/careers/ApplyForm";
import PostedAgo from "@/components/careers/PostedAgo";
import ShareButton from "@/components/careers/ShareButton";
import { useDrawerClose } from "@/components/careers/Drawer";
import { markApplied } from "@/components/careers/useAppliedJobs";
import { jobHref, locationLabel, payLabel } from "@/lib/job-format";

// One role (or the talent network when `job` is null) in three steps: detail → apply → done.
// variant "drawer" renders inside <Drawer>; "page" renders on the full /careers/[slug] page.
export default function JobPanel({ job = null, similar = [], variant = "drawer" }) {
  const general = !job;
  const initial = general ? "apply" : "detail";
  const [mode, setMode] = useState(initial);
  const [firstName, setFirstName] = useState("");
  const submitted = useRef(false);
  const rootRef = useRef(null);
  const bodyRef = useRef(null);
  const headingRef = useRef(null);
  const headingId = useId();
  const closeDrawer = useDrawerClose();
  const H = variant === "page" ? "h1" : "h2";

  // Activity keeps this mounted when hidden; after a successful submit, start fresh next time.
  useLayoutEffect(
    () => () => {
      if (submitted.current) {
        submitted.current = false;
        setMode(initial);
      }
    },
    [initial]
  );

  function go(next) {
    setMode(next);
    requestAnimationFrame(() => {
      if (variant === "drawer" && bodyRef.current) bodyRef.current.scrollTop = 0;
      else rootRef.current?.scrollIntoView({ block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function onSubmitted(name) {
    submitted.current = true;
    setFirstName(name);
    if (job) markApplied(job.id);
    go("done");
  }

  const heading =
    mode === "done" ? (general ? "You’re in" : "Application received") : general ? "Join our talent network" : mode === "apply" ? "Apply" : job.title;

  return (
    <div className={`cr-panel cr-panel--${variant}`} ref={rootRef}>
      <header className="cr-pn-head">
        {mode === "apply" && !general && (
          <button type="button" className="cr-back" onClick={() => go("detail")}>
            <Icon name="arrowLeft" strokeWidth={2} /> Back to role
          </button>
        )}
        <p className="cr-pn-ref mono">
          {general ? (
            "Talent network"
          ) : (
            <>
              Ref {job.id} · posted <PostedAgo iso={job.postedAt} />
            </>
          )}
        </p>
        <H id={headingId} ref={headingRef} tabIndex={-1} className="cr-pn-title">
          {heading}
        </H>
        <p className="cr-pn-sub">
          {general ? (
            "One profile — we’ll match you to roles as they open, across every stack and level."
          ) : mode === "detail" ? (
            <>
              <Icon name="pin" strokeWidth={2} />
              {locationLabel(job)} · {job.workplace}
            </>
          ) : (
            `${job.title} · ${locationLabel(job)}`
          )}
        </p>
      </header>

      <div className="cr-pn-body" ref={bodyRef}>
        {mode === "detail" && <JobDetail job={job} />}
        {mode === "apply" && <ApplyForm job={job} onSubmitted={onSubmitted} />}
        {mode === "done" && (
          <Done general={general} job={job} firstName={firstName} similar={similar} variant={variant} onBrowse={closeDrawer} />
        )}
      </div>

      {mode === "detail" && (
        <footer className="cr-pn-foot">
          <ShareButton path={jobHref(job)} title={`${job.title} — DG-ALLEN`} />
          <button type="button" className="btn btn-red cr-apply" onClick={() => go("apply")}>
            Apply for this role
            <Icon name="arrowRight" strokeWidth={2.2} />
          </button>
          <p className="cr-foot-note">
            <Icon name="clock" strokeWidth={2} /> Recruiter reply within 2 business days · No fees, ever
          </p>
        </footer>
      )}
    </div>
  );
}

function Done({ general, job, firstName, similar, variant, onBrowse }) {
  return (
    <div className="cr-done">
      <div className="cr-ring" aria-hidden="true">
        <Icon name="check" strokeWidth={2.4} />
      </div>
      <p className="cr-done-lead">
        {general ? (
          <>Thanks{firstName ? `, ${firstName}` : ""}. We’ll reach out as roles matching your profile open up.</>
        ) : (
          <>
            Thanks{firstName ? `, ${firstName}` : ""}. Your application for <b>{job.title}</b> is with our recruiters.
          </>
        )}
      </p>

      <div className="cr-next">
        <h3>What happens next</h3>
        <ol>
          <li>A recruiter reviews your profile — usually within 2 business days.</li>
          <li>If it’s a fit, we call to confirm details, rate and work authorization.</li>
          <li>We submit you to the client and coordinate interviews.</li>
        </ol>
      </div>

      {similar.length > 0 && (
        <div className="cr-similar">
          <h3>Similar roles you could apply to</h3>
          <SimilarList jobs={similar} replace={variant === "drawer"} />
        </div>
      )}

      {onBrowse ? (
        <button type="button" className="btn btn-ghost cr-wide" onClick={onBrowse}>
          Browse all roles
        </button>
      ) : (
        <Link className="btn btn-ghost cr-wide" href="/careers">
          Browse all roles
        </Link>
      )}
    </div>
  );
}

// `replace` inside the drawer so closing it returns to the list in one step.
export function SimilarList({ jobs, replace = false }) {
  return (
    <ul className="cr-sim-list">
      {jobs.map((j) => (
        <li key={j.id}>
          <Link href={jobHref(j)} replace={replace} scroll={false} className="cr-sim">
            <span className="cr-sim-t">{j.title}</span>
            <span className="cr-sim-m">
              {locationLabel(j)} · <span className="mono">{payLabel(j)}</span>
            </span>
            <Icon name="arrowRight" strokeWidth={2} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
