"use client";

import { LEVELS, WORKPLACES, ENGAGEMENTS, WORK_AUTH } from "@/data/jobs";

// Filter groups. Each option shows how many roles it would return given the other active filters.
export default function FilterRail({ filters, counts, onChange, onClear }) {
  const toggle = (key, value) => {
    const list = filters[key];
    onChange({ [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  return (
    <>
      <div className="cr-rail-head">
        <h2>Refine</h2>
        <button type="button" onClick={onClear}>
          Clear all
        </button>
      </div>

      <fieldset className="cr-fgroup">
        <legend>Experience</legend>
        <Opt type="radio" name="level" label="Any experience" count={counts.level.any} checked={!filters.level} onChange={() => onChange({ level: "" })} />
        {LEVELS.map((l) => (
          <Opt
            key={l.id}
            type="radio"
            name="level"
            label={l.label}
            sub={l.range}
            count={counts.level[l.id]}
            checked={filters.level === l.id}
            onChange={() => onChange({ level: l.id })}
          />
        ))}
      </fieldset>

      <fieldset className="cr-fgroup">
        <legend>Work location</legend>
        {WORKPLACES.map((w) => (
          <Opt key={w} type="checkbox" label={w} count={counts.workplace[w]} checked={filters.workplace.includes(w)} onChange={() => toggle("workplace", w)} />
        ))}
      </fieldset>

      <fieldset className="cr-fgroup">
        <legend>Engagement</legend>
        {ENGAGEMENTS.map((e) => (
          <Opt key={e} type="checkbox" label={e} count={counts.engagement[e]} checked={filters.engagement.includes(e)} onChange={() => toggle("engagement", e)} />
        ))}
      </fieldset>

      <fieldset className="cr-fgroup">
        <legend>Your work authorization</legend>
        <p className="cr-fgroup-hint">Show roles that accept your status.</p>
        <Opt type="radio" name="auth" label="Any status" count={counts.auth.any} checked={!filters.auth} onChange={() => onChange({ auth: "" })} />
        {WORK_AUTH.map((a) => (
          <Opt key={a.code} type="radio" name="auth" label={a.label} count={counts.auth[a.code]} checked={filters.auth === a.code} onChange={() => onChange({ auth: a.code })} />
        ))}
      </fieldset>
    </>
  );
}

function Opt({ type, name, label, sub, count, checked, onChange }) {
  return (
    <label className={`cr-opt${type === "radio" ? " cr-opt--radio" : ""}${count === 0 && !checked ? " cr-opt--zero" : ""}`}>
      <input type={type} name={name} checked={checked} onChange={onChange} />
      <span className="cr-mark" aria-hidden="true" />
      <span className="cr-opt-lbl">
        {label}
        {sub && <span className="cr-opt-sub"> · {sub}</span>}
      </span>
      <span className="cr-opt-cnt" aria-label={`${count} roles`}>
        {count}
      </span>
    </label>
  );
}
