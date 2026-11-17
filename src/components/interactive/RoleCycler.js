"use client";

import { useEffect, useState } from "react";
import { HERO } from "@/data/content";

const ROLES = HERO.roles;

export default function RoleCycler() {
  const [index, setIndex] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    let swap;
    const id = setInterval(() => {
      setOut(true);
      swap = setTimeout(() => {
        setIndex((i) => (i + 1) % ROLES.length);
        setOut(false);
      }, 260);
    }, 2200);
    return () => {
      clearInterval(id);
      clearTimeout(swap);
    };
  }, []);

  return (
    <span className="cyc">
      <span
        className="c-in"
        style={out ? { opacity: 0, transform: "translateY(-8px)" } : { opacity: 1, transform: "none" }}
      >
        {ROLES[index]}
      </span>
    </span>
  );
}
