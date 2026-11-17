import Button from "@/components/ui/Button";
import { AUDIENCES } from "@/data/content";

// "Two doors" — one card for candidates, one for hiring teams.
export default function Audiences() {
  return (
    <section className="sec" id="jobs">
      <div className="shell">
        <h2 className="reveal">Two ways in. One quick match.</h2>
        <div className="doors">
          {AUDIENCES.map((a) => (
            <div className={`door${a.accent ? " accent" : ""} reveal`} key={a.title}>
              <div className="glow" />
              <div className="tg">{a.tag}</div>
              <h3>{a.title}</h3>
              <p>{a.body}</p>
              <Button href={a.cta.href} variant={a.cta.variant} size="lg">
                {a.cta.label}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
