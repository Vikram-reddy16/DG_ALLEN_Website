import { STEPS } from "@/data/content";

export default function Process() {
  return (
    <section className="sec alt" id="process">
      <div className="shell">
        <span className="kick reveal">How it works</span>
        <h2 className="reveal">From requirement to placement, in days.</h2>
        <div className="flow">
          <div className="line" aria-hidden="true" />
          <div className="linefill" aria-hidden="true" />
          <div className="steps gstag">
            {STEPS.map((step, i) => (
              <div className="step reveal" key={step.title}>
                <div className="node">{String(i + 1).padStart(2, "0")}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
