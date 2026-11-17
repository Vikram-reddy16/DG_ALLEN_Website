"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

// Native share sheet on touch devices (WhatsApp, LinkedIn…), copy-link everywhere else.
export default function ShareButton({ path, title }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  async function share() {
    const url = `${window.location.origin}${path}`;
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user dismissed the sheet
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button type="button" className="cr-icon-btn" onClick={share} aria-label={copied ? "Link copied" : "Share this role"}>
      <Icon name={copied ? "check" : "share"} strokeWidth={2} />
      <span className="cr-tip" aria-hidden="true">
        {copied ? "Link copied" : "Share"}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </button>
  );
}
