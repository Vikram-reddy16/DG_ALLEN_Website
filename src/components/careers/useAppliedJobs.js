"use client";

import { useMemo, useSyncExternalStore } from "react";

// Remembers which roles this browser has applied to, so cards can show "Applied".
// Per-device only; move to Supabase once candidates have accounts.
const KEY = "dga:applied";
const EVENT = "dga:applied-change";

function read() {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(cb) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

export function useAppliedJobs() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  return useMemo(() => {
    try {
      return new Set(JSON.parse(raw));
    } catch {
      return new Set();
    }
  }, [raw]);
}

export function markApplied(id) {
  try {
    const ids = new Set(JSON.parse(read()));
    ids.add(id);
    localStorage.setItem(KEY, JSON.stringify([...ids]));
  } catch {
    // storage blocked (private mode) — the badge just won't persist
  }
  window.dispatchEvent(new Event(EVENT));
}
