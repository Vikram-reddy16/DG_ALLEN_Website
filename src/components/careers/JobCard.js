import Link from "next/link";
import Icon from "@/components/ui/Icon";
import PostedAgo from "@/components/careers/PostedAgo";
import { experienceLabel, jobHref, locationLabel, payLabel } from "@/lib/job-format";

// The title is a real link (opens the drawer, or the full page on refresh / new tab),
// stretched over the whole card so the entire card is clickable.
export default function JobCard({ job, applied }) {
  const skills = job.skills.slice(0, 4);
  const extra = job.skills.length - skills.length;
  return (
    <article className="cr-job">
      <div className="cr-job-top">
        <PostedAgo iso={job.postedAt} className="cr-job-posted" />
        {applied && (
          <span className="cr-applied">
            <Icon name="check" strokeWidth={2.6} /> Applied
          </span>
        )}
      </div>
      <h3 className="cr-job-title">
        <Link href={jobHref(job)} scroll={false} className="cr-job-link">
          {job.title}
        </Link>
      </h3>
      <p className="cr-job-loc">
        <Icon name="pin" strokeWidth={2} />
        {locationLabel(job)}
        <span className="cr-job-wp">{job.workplace}</span>
      </p>
      <div className="cr-pills">
        {job.engagement.map((e) => (
          <span key={e} className="cr-pill cr-pill--eng">
            {e}
          </span>
        ))}
        <span className="cr-pill cr-pill--yrs">{experienceLabel(job)}</span>
        <span className="cr-pay">{payLabel(job)}</span>
      </div>
      <ul className="cr-skills" aria-label="Key skills">
        {skills.map((s) => (
          <li key={s} className="cr-sk">
            {s}
          </li>
        ))}
        {extra > 0 && <li className="cr-sk cr-sk--more">+{extra}</li>}
      </ul>
      <div className="cr-job-foot">
        <span className="cr-job-auth">
          Accepts: <b>{job.workAuth.slice(0, 4).join(", ")}{job.workAuth.length > 4 ? "…" : ""}</b>
        </span>
        <span className="cr-view" aria-hidden="true">
          View &amp; apply <Icon name="arrowRight" strokeWidth={2.4} />
        </span>
      </div>
    </article>
  );
}
