import { STATS } from "@/data/content";

// Numbers count up on scroll via PageEffects (targets .count[data-to]).
export default function Stats() {
  return (
    <section className="sec statband" id="about">
      <div className="shell">
        <div className="head">
          <h2 className="reveal">Built to move teams forward.</h2>
          <p className="lead reveal" style={{ marginTop: 0 }}>
            A senior team that stays close to every placement — no handoff chains, no telephone game.
          </p>
        </div>
        <div className="stats gstag" style={{ marginTop: 52 }}>
          {STATS.map((s) => (
            <div className="stat reveal" key={s.label}>
              <div className="n">
                <span className="count" data-to={s.to}>
                  0
                </span>
                <b>{s.suffix}</b>
              </div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
