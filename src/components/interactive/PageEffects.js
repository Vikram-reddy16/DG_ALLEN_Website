"use client";

import { useEffect } from "react";

// Scroll reveals, stat counters, magnetic buttons, card spotlight and the process timeline.
// Works on the server-rendered markup by class name, mirroring the original script.
export default function PageEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const cleanups = [];
    const timers = [];

    // reveal on scroll
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.14 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // count-up stats
    const rafs = new Set();
    const cio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          cio.unobserve(e.target);
          const el = e.target;
          const to = +el.dataset.to;
          if (reduce) {
            el.textContent = to.toLocaleString("en-US");
            return;
          }
          let s = null;
          const tick = (t) => {
            if (!s) s = t;
            const p = Math.min(1, (t - s) / 1400);
            el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * to).toLocaleString("en-US");
            if (p < 1) {
              const id = requestAnimationFrame(tick);
              rafs.add(id);
            } else el.textContent = to.toLocaleString("en-US");
          };
          rafs.add(requestAnimationFrame(tick));
        }),
      { threshold: 0.5 }
    );
    document.querySelectorAll(".count").forEach((el) => cio.observe(el));
    cleanups.push(() => {
      cio.disconnect();
      rafs.forEach((id) => cancelAnimationFrame(id));
    });

    // magnetic buttons
    if (!reduce) {
      document.querySelectorAll(".magnetic").forEach((b) => {
        const move = (e) => {
          const r = b.getBoundingClientRect();
          b.style.transform =
            "translate(" +
            ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) +
            "px," +
            ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) +
            "px)";
        };
        const leave = () => (b.style.transform = "");
        b.addEventListener("pointermove", move);
        b.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          b.removeEventListener("pointermove", move);
          b.removeEventListener("pointerleave", leave);
        });
      });
    }

    // service card cursor spotlight
    document.querySelectorAll(".svc").forEach((c) => {
      const move = (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", e.clientX - r.left + "px");
        c.style.setProperty("--my", e.clientY - r.top + "px");
      };
      c.addEventListener("pointermove", move);
      cleanups.push(() => c.removeEventListener("pointermove", move));
    });

    // process timeline: fill line + light nodes in sequence
    const flow = document.querySelector(".flow");
    if (flow) {
      const fsteps = flow.querySelectorAll(".step");
      if (reduce) {
        flow.classList.add("active");
        fsteps.forEach((s) => s.classList.add("on"));
      } else {
        const fio = new IntersectionObserver(
          (es) =>
            es.forEach((e) => {
              if (e.isIntersecting) {
                fio.unobserve(e.target);
                flow.classList.add("active");
                fsteps.forEach((st, i) => timers.push(setTimeout(() => st.classList.add("on"), 300 + i * 320)));
              }
            }),
          { threshold: 0.4 }
        );
        fio.observe(flow);
        cleanups.push(() => fio.disconnect());
      }
    }

    return () => {
      timers.forEach(clearTimeout);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
