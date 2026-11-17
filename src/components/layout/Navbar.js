"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import Wordmark from "@/components/ui/Wordmark";
import Button from "@/components/ui/Button";
import SmartLink from "@/components/ui/SmartLink";
import { NAV_LINKS } from "@/data/content";

// active: key of the current section ("careers") for aria-current.
// variant "careers" swaps the CTA to candidate-first actions.
export default function Navbar({ active, variant = "home", brandHref = "#top" }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(document.documentElement.scrollTop > 40);
    }
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="shell">
        <div className="in">
          <SmartLink className="brand" href={brandHref} aria-label="DG-ALLEN home">
            <Logo />
            <Wordmark />
          </SmartLink>
          <nav className="links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <SmartLink key={l.href} href={l.href} aria-current={l.key === active ? "page" : undefined}>
                {l.label}
              </SmartLink>
            ))}
          </nav>
          {variant === "careers" ? (
            <div className="nav-cta">
              <Button href="/careers" variant="ghost" size="sm" className="hide-sm">
                Hire talent
              </Button>
              <Button href="/careers/join" scroll={false}>
                Submit résumé
              </Button>
            </div>
          ) : (
            <Button href="/careers">Get in touch</Button>
          )}
        </div>
      </div>
    </div>
  );
}
