"use client";

import { useEffect, useRef } from "react";

const ACID = "#FF1E1E";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function NDGGCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // тільки для мишки/трекпаду
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    document.documentElement.classList.add("ndgg-cursor");

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      document.documentElement.classList.add("ndgg-cursor--active");
    };

    const onLeave = () => {
      document.documentElement.classList.remove("ndgg-cursor--active");
    };

    const onDown = () => document.documentElement.classList.add("ndgg-cursor--down");
    const onUp = () => document.documentElement.classList.remove("ndgg-cursor--down");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    let raf = 0;
    const tick = () => {
      const dot = dotRef.current;
      const ringEl = ringRef.current;
      if (dot && ringEl) {
        // dot прилип до миші
        dot.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px)`;

        // ring доганяє (інерція)
        ring.current.x = lerp(ring.current.x, mouse.current.x, 0.14);
        ring.current.y = lerp(ring.current.y, mouse.current.y, 0.14);
        ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.classList.remove("ndgg-cursor");
      document.documentElement.classList.remove("ndgg-cursor--active");
      document.documentElement.classList.remove("ndgg-cursor--down");
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="ndgg-cursor-ring"
        aria-hidden
      />
      <div
        ref={dotRef}
        className="ndgg-cursor-dot"
        style={{ backgroundColor: ACID, boxShadow: "0 0 18px rgba(255,30,30,0.35)" }}
        aria-hidden
      />
    </>
  );
}
