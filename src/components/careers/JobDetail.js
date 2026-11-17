import { authLabel, experienceLabel, payLabel } from "@/lib/job-format";

// The body of a job post: summary, lists, skills, and engagement facts.
export default function JobDetail({ job }) {
  return (
    <>
      <div className="cr-pills">
        {job.engagement.map((e) => (
          <span key={e} className="cr-pill cr-pill--eng">
            {e}
          </span>
        ))}
        <span className="cr-pill cr-pill--yrs">{experienceLabel(job)}</span>
        <span className="cr-pay">{payLabel(job)}</span>
      </div>

      <p className="cr-summary">{job.summary}</p>

      <Section title="What you’ll do" items={job.responsibilities} />
      <Section title="What you’ll need" items={job.requirements} />
      {job.niceToHave?.length > 0 && <Section title="Nice to have" items={job.niceToHave} />}

      <section className="cr-sec">
        <h3>Core skills</h3>
        <ul className="cr-skills">
          {job.skills.map((s) => (
            <li key={s} className="cr-sk">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="cr-sec">
        <h3>Engagement details</h3>
        <dl className="cr-kv">
          <dt>Duration</dt>
          <dd>{job.duration}</dd>
          <dt>Pay range</dt>
          <dd className="mono">{payLabel(job)}</dd>
          <dt>Terms</dt>
          <dd>{job.engagement.join(" · ")}</dd>
          <dt>Work auth</dt>
          <dd>
            <ul className="cr-skills">
              {job.workAuth.map((a) => (
                <li key={a} className="cr-sk">
                  {authLabel(a)}
                </li>
              ))}
            </ul>
          </dd>
        </dl>
      </section>
    </>
  );
}

function Section({ title, items }) {
  return (
    <section className="cr-sec">
      <h3>{title}</h3>
      <ul className="cr-list">
        {items.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </section>
  );
}
