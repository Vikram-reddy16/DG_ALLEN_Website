"use client";

import { useEffect, useRef } from "react";
import { SKILLS } from "@/data/content";

export default function TalentSphere() {
  const zoneRef = useRef(null);
  const hostRef = useRef(null);

  useEffect(() => {
    const zone = zoneRef.current;
    const host = hostRef.current;
    const hero = zone.closest(".hero") || zone;
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    let R = 170;
    const persp = 2.4;
    let angX = 0.2, angY = 0, velX = 0, velY = 0;
    const mouse = { x: 0, y: 0, on: false };
    let items = [];
    let mobile = false;
    let raf = 0;

    function layout() {
      const w = zone.clientWidth;
      mobile = window.innerWidth < 980;
      R = mobile ? Math.min(120, w * 0.36) : Math.min(185, w * 0.34);
    }

    function build() {
      host.innerHTML = "";
      items = [];
      const list = mobile ? SKILLS.slice(0, 14) : SKILLS;
      const N = list.length;
      for (let i = 0; i < N; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
        const th = Math.PI * (1 + Math.sqrt(5)) * i;
        const x = Math.sin(phi) * Math.cos(th);
        const y = Math.sin(phi) * Math.sin(th);
        const z = Math.cos(phi);
        const el = document.createElement("span");
        el.textContent = list[i][0];
        if (list[i][1]) el.className = "hot";
        host.appendChild(el);
        items.push({ x, y, z, el });
      }
    }

    function render() {
      const cX = Math.cos(angX), sX = Math.sin(angX), cY = Math.cos(angY), sY = Math.sin(angY);
      for (const it of items) {
        const x1 = it.x * cY + it.z * sY;
        const z1 = -it.x * sY + it.z * cY;
        const y1 = it.y;
        const y2 = y1 * cX - z1 * sX;
        const z2 = y1 * sX + z1 * cX;
        const x2 = x1;
        const sc = persp / (persp - z2);
        const px = x2 * R * sc;
        const py = y2 * R * sc;
        const t = (z2 + 1) / 2;
        const fs = (mobile ? 12 : 14) * (0.72 + 0.62 * t);
        const s = it.el.style;
        s.transform = "translate(-50%,-50%) translate(" + px.toFixed(1) + "px," + py.toFixed(1) + "px)";
        s.fontSize = fs.toFixed(1) + "px";
        s.opacity = (0.3 + 0.7 * t).toFixed(2);
        s.zIndex = String((t * 100) | 0);
        s.filter = t < 0.5 ? "blur(" + ((0.5 - t) * 2).toFixed(1) + "px)" : "none";
      }
    }

    function tick() {
      if (!reduce) {
        let dY = 0.0024, dX = 0;
        if (mouse.on) {
          dY = 0.0024 + mouse.x * 0.012;
          dX = mouse.y * 0.01;
        }
        velY += (dY - velY) * 0.04;
        velX += (dX - velX) * 0.04;
        angY += velY;
        angX += velX;
        if (angX > 0.9) angX = 0.9;
        if (angX < -0.9) angX = -0.9;
      }
      render();
      if (!reduce) raf = requestAnimationFrame(tick);
    }

    function onMove(e) {
      const r = host.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / (zone.clientWidth * 0.5);
      mouse.y = (e.clientY - r.top) / (zone.clientHeight * 0.5);
      mouse.on = true;
    }
    function onLeave() {
      mouse.on = false;
    }
    function onResize() {
      layout();
      build();
      render();
    }

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    layout();
    build();
    render();
    if (!reduce) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      host.innerHTML = "";
    };
  }, []);

  return (
    <div className="sphereZone" aria-hidden="true" ref={zoneRef}>
      <div className="core" />
      <div className="ring" />
      <div className="sphere" ref={hostRef} />
    </div>
  );
}
