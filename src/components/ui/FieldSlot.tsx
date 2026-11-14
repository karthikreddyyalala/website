"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motionOK } from "./Fx";

// The shader is its own chunk, fetched only when it is going to run.
const HeroField = dynamic(() => import("./HeroField").then((m) => m.HeroField), { ssr: false });

/**
 * Decides whether the hero's signal field runs at all. It does only on
 * screens 768px and wider, with motion allowed and Save-Data off, and only
 * after the page has loaded and the browser is idle. Everywhere else the
 * static poster underneath is the whole picture, and no canvas is created.
 */
export function FieldSlot() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const saving = () => Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    const decide = () => setOn(wide.matches && motionOK() && !saving());

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const start = () => idle(decide, { timeout: 2500 });
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    wide.addEventListener("change", decide);
    window.addEventListener("motion:change", decide);
    return () => {
      window.removeEventListener("load", start);
      wide.removeEventListener("change", decide);
      window.removeEventListener("motion:change", decide);
    };
  }, []);

  return on ? <HeroField /> : null;
}
