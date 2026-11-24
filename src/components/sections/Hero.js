import { Fragment } from "react";
import Button from "@/components/ui/Button";
import RoleCycler from "@/components/interactive/RoleCycler";
import TalentSphere from "@/components/interactive/TalentSphere";
import { HERO } from "@/data/content";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="shell">
        <div className="hgrid">
          <div className="hcopy">
            <h1>
              {HERO.words.map((w, i) => (
                <Fragment key={w}>
                  <span className="w" style={{ animationDelay: `${(0.05 + i * 0.07).toFixed(2)}s` }}>
                    {w}
                  </span>{" "}
                </Fragment>
              ))}
            </h1>
            <p className="subline">
              Screened, interviewed and onboarded IT talent for companies and vendors across the U.S.
              <span className="cyc-line">
                <span className="cyc-lead">Now placing</span> <RoleCycler />
              </span>
            </p>
            <div className="hcta">
              <Button href="/careers" size="lg" magnetic>
                Hire IT talent
              </Button>
              <Button href="#jobs" variant="ghost" size="lg">
                Find your next role
              </Button>
            </div>
            <div className="terms">
              <span className="lab">Hire on</span>
              {HERO.terms.map((t) => (
                <i key={t}>{t}</i>
              ))}
            </div>
          </div>
          <TalentSphere />
        </div>
      </div>
    </header>
  );
}
