import Icon from "@/components/ui/Icon";
import { SERVICES } from "@/data/content";

export default function Services() {
  return (
    <section className="sec" id="services">
      <div className="shell">
        <span className="kick reveal">Services</span>
        <h2 className="reveal">Full-cycle IT staffing, handled end to end.</h2>
        <p className="lead reveal">
          From a single urgent contractor to a whole delivery team — sourced, screened and placed on the terms that
          fit.
        </p>
        <div className="cards gstag">
          {SERVICES.map((s, i) => (
            <div className="svc reveal" key={s.title}>
              <div className="top">
                <span className="ic">
                  <Icon name={s.icon} />
                </span>
                <span className="ix">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
