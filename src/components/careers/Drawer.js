"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";

// Side drawer used by the intercepted /careers/* routes. Closing goes back in history,
// so the browser Back button and the close button behave the same.
const DrawerCloseContext = createContext(null);
export const useDrawerClose = () => useContext(DrawerCloseContext);

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export default function Drawer({ label, children }) {
  const router = useRouter();
  const panelRef = useRef(null);
  const timer = useRef(null);
  const [closing, setClosing] = useState(false);

  const close = useCallback(() => {
    if (timer.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.back();
      return;
    }
    setClosing(true);
    timer.current = setTimeout(() => router.back(), 190);
  }, [router]);

  // Cache Components keeps hidden routes mounted (React Activity). Reset the closing
  // animation when hidden so the drawer opens cleanly next time.
  useLayoutEffect(
    () => () => {
      clearTimeout(timer.current);
      timer.current = null;
      setClosing(false);
    },
    []
  );

  // While visible: lock page scroll, make the page behind inert, focus the dialog.
  // Cleanup restores everything and returns focus to the card that opened it.
  useEffect(() => {
    const opener = document.activeElement;
    const main = document.getElementById("careers-main");
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    if (main) main.inert = true;
    html.style.overflow = "hidden";
    panelRef.current?.focus();

    function onKey(e) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (main) main.inert = false;
      html.style.overflow = prevOverflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [close]);

  function trapTab(e) {
    if (e.key !== "Tab") return;
    const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div className={`cr-drawer-root${closing ? " closing" : ""}`}>
      <div className="cr-scrim" onClick={close} aria-hidden="true" />
      <div
        className="cr-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        ref={panelRef}
        onKeyDown={trapTab}
      >
        <button type="button" className="cr-dw-close" onClick={close} aria-label="Close">
          <Icon name="close" strokeWidth={2} />
        </button>
        <DrawerCloseContext.Provider value={close}>{children}</DrawerCloseContext.Provider>
      </div>
    </div>
  );
}
