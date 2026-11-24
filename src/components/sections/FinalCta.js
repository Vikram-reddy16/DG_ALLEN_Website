import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { ADDRESS_LINES, ADDRESS_MAP_URL, BRAND } from "@/data/content";

export default function FinalCta() {
  return (
    <section className="sec final alt" id="contact">
      <div className="shell">
        <div className="box reveal">
          <div className="g1" />
          <h2>Ready to find your next match?</h2>
          <p>Tell us what you’re hiring for — or what you’re looking for — and we’ll get moving today.</p>
          <div className="hcta">
            <Button href="/careers" size="lg" magnetic>
              Get in touch
            </Button>
            <Button href="/careers/join" variant="ghost" size="lg">
              Submit a resume
            </Button>
          </div>
          <div className="contact-row">
            <a className="addr" href={BRAND.phoneHref}>
              <Icon name="phone" strokeWidth={1.8} />
              {BRAND.phone}
            </a>
            <a className="addr" href={`mailto:${BRAND.email}`}>
              <Icon name="mail" strokeWidth={1.8} />
              {BRAND.email}
            </a>
          </div>
          <address className="addr">
            <Icon name="pin" strokeWidth={1.8} />
            <a href={ADDRESS_MAP_URL} target="_blank" rel="noopener noreferrer">
              {ADDRESS_LINES.join(", ")}
            </a>
          </address>
        </div>
      </div>
    </section>
  );
}
