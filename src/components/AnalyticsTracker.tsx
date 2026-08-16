"use client";

import { useEffect, useRef } from "react";
import { incrementPageViews } from "@/lib/analytics";

export function AnalyticsTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current && !window.location.pathname.startsWith("/admin")) {
      incrementPageViews();
      tracked.current = true;
    }
  }, []);

  return null;
}
