import Icon from "@/components/ui/Icon";
import { INDUSTRIES } from "@/data/content";

export default function Industries() {
  return (
    <section className="sec" id="industries">
      <div className="shell">
        <h2 className="reveal">Specialized talent for every sector.</h2>
        <div className="inds gstag" style={{ marginTop: 34 }}>
          {INDUSTRIES.map((ind) => (
            <div className="ind reveal" key={ind.name}>
              <Icon name={ind.icon} strokeWidth="1.9" />
              <span>{ind.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
