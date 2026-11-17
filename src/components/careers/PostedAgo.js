"use client";

import { useSyncExternalStore } from "react";
import { shortDate } from "@/lib/job-format";

const DAY = 86400000;
const subscribe = () => () => {};
const today = () => Math.floor(Date.now() / DAY);

// Server/prerender shows the absolute date ("Nov 12"); the browser upgrades it to "2d ago".
// Reading the clock during prerender would break the build under Cache Components.
export default function PostedAgo({ iso, className }) {
  const now = useSyncExternalStore(subscribe, today, () => null);
  let label = shortDate(iso);
  if (now !== null) {
    const days = now - Math.floor(Date.parse(`${iso}T00:00:00Z`) / DAY);
    if (days <= 0) label = "Today";
    else if (days === 1) label = "Yesterday";
    else if (days < 7) label = `${days}d ago`;
    else if (days < 30) label = `${Math.floor(days / 7)}w ago`;
  }
  return (
    <time className={className} dateTime={iso}>
      {label}
    </time>
  );
}
