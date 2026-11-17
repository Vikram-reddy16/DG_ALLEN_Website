"use client";

import { useEffect, useImperativeHandle, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadScript() {
  if (window.turnstile) return Promise.resolve();
  if (!window.__tsLoading) {
    window.__tsLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return window.__tsLoading;
}

// Cloudflare Turnstile widget. Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset
// (local dev). Parent reads the token via ref.current.getToken() and calls ref.current.reset()
// after each attempt, because tokens are single-use.
export default function Turnstile({ ref }) {
  const box = useRef(null);
  const widget = useRef(null);
  const token = useRef("");

  useImperativeHandle(ref, () => ({
    getToken: () => token.current,
    reset: () => {
      token.current = "";
      if (widget.current != null) window.turnstile?.reset(widget.current);
    },
  }));

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !box.current || widget.current != null) return;
        widget.current = window.turnstile.render(box.current, {
          sitekey: SITE_KEY,
          callback: (t) => (token.current = t),
          "expired-callback": () => (token.current = ""),
          "error-callback": () => (token.current = ""),
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (widget.current != null) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, []);

  return SITE_KEY ? <div ref={box} className="cr-turnstile" /> : null;
}
