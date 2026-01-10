// app/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SiteFooter from "@/components/footer/SiteFooter";
import FeedbackForm from "@/components/feedback/FeedbackForm";

const ACID = "#FF1E1E";

/* ----------------------------- utils ----------------------------- */

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function useActiveSection<const T extends readonly string[]>(sectionIds: T) {
  type Id = T[number];

  const [active, setActive] = useState<Id>(sectionIds[0]);

  const refs = useMemo(() => {
    const map = new Map<Id, React.RefObject<HTMLElement | null>>();
    sectionIds.forEach((id) => {
      map.set(id, { current: null });
    });
    return map;
  }, [sectionIds]);

  useEffect(() => {
    const els = sectionIds
      .map((id) => refs.get(id)?.current)
      .filter((el): el is HTMLElement => el instanceof HTMLElement);

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        const id = best?.target?.getAttribute("data-section");
        if (id && sectionIds.includes(id as Id)) setActive(id as Id);
      },
      { threshold: [0.25, 0.5, 0.75] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [refs, sectionIds]);

  return { active, refs };
}

/* ------------------------- custom cursor ------------------------- */

function NDGGCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    // hide native cursor via class (add CSS in globals if you want, but we can do minimal inline)
    document.documentElement.classList.add("ndgg-cursor");

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      document.documentElement.classList.add("ndgg-cursor--active");
    };
    const onLeave = () => document.documentElement.classList.remove("ndgg-cursor--active");
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

      if (dot) {
        dot.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px)`;
      }
      if (ringEl) {
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

  // minimal styles inline, але щоб "cursor:none" спрацював — додай CSS знизу (я дав після коду)
  return (
    <>
      <div
        ref={ringRef}
        className="ndgg-cursor-ring"
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 36,
          height: 36,
          borderRadius: 999,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9998,
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(2px)",
          willChange: "transform, opacity",
        }}
      />
      <div
        ref={dotRef}
        className="ndgg-cursor-dot"
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 8,
          height: 8,
          borderRadius: 999,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
          backgroundColor: ACID,
          boxShadow: "0 0 18px rgba(255,30,30,0.35)",
          willChange: "transform, opacity",
        }}
      />
      {/* simple class-driven visibility */}
      <style>{`
        @media (pointer: fine) {
          html.ndgg-cursor, html.ndgg-cursor * { cursor: none !important; }
        }
        html.ndgg-cursor--active .ndgg-cursor-dot,
        html.ndgg-cursor--active .ndgg-cursor-ring { opacity: 1; }
        html.ndgg-cursor--down .ndgg-cursor-ring { width: 28px; height: 28px; }
      `}</style>
    </>
  );
}

/* --------------------------- UI blocks --------------------------- */

function ScrollHint({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-10 right-10 flex items-center gap-3 select-none"
      aria-label="Scroll to next section"
    >
      <span className="text-white/45 text-xs tracking-[0.25em] uppercase">scroll</span>
      <span style={{ color: ACID }} className="text-lg leading-none">
        ↓
      </span>
    </button>
  );
}


function Hero({ onScrollNext }: { onScrollNext: () => void }) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="h-svh w-full overflow-y-auto snap-y snap-mandatory scroll-smooth overscroll-contain">
      <div className="h-full flex items-center">
        <div className="ml-[max(24px,6vw)]">
          <motion.h1
            className="font-semibold text-white leading-[0.95] tracking-[-0.03em]"
            style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: prefersReduced ? 0 : 0.35, delay: prefersReduced ? 0 : 0.15 },
            }}
          >
            NOT DONE<span style={{ color: ACID }}>.</span>
          </motion.h1>

          <motion.h2
            className="font-extrabold text-white leading-[0.95] tracking-[-0.03em] mt-3"
            style={{ fontSize: "clamp(44px, 7vw, 104px)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: prefersReduced ? 0 : 0.35, delay: prefersReduced ? 0 : 0.32 },
            }}
          >
            GO FURTHER<span style={{ color: ACID }}>.</span>
          </motion.h2>

          <motion.div
            className="mt-6 h-px w-[min(520px,70vw)] bg-white/10"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={{
              scaleX: 1,
              transition: { duration: prefersReduced ? 0 : 0.45, delay: prefersReduced ? 0 : 0.45 },
            }}
          />
          <motion.div
            className="mt-2 h-px w-[min(380px,55vw)]"
            style={{ backgroundColor: ACID }}
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={{
              scaleX: 1,
              transition: { duration: prefersReduced ? 0 : 0.45, delay: prefersReduced ? 0 : 0.55 },
            }}
          />
        </div>
      </div>

      <ScrollHint onClick={onScrollNext} />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% 40%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(900px 500px at 90% 70%, rgba(255,30,30,0.06), transparent 65%)",
        }}
      />
    </div>
  );
}

function Manifest() {
  const prefersReduced = useReducedMotion();

  const lines = [
    { a: "WE DON’T FINISH.", b: "WE MOVE FORWARD." },
    { a: "PROGRESS IS UGLY.", b: "THAT’S WHY IT’S REAL." },
    { a: "NOT DONE IS THE STATE.", b: "FINISHING IS A LIE." },
  ];

  return (
    <div className="h-full w-full flex items-center">
      <div className="ml-[max(24px,6vw)] mr-[max(24px,6vw)] w-full">
        <div className="max-w-230">
          {lines.map((pair, i) => (
            <motion.div
              key={pair.a}
              className="py-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.55 }}
              transition={{ duration: prefersReduced ? 0 : 0.35, delay: prefersReduced ? 0 : i * 0.05 }}
            >
              <div className="text-white font-bold tracking-[-0.02em]" style={{ fontSize: "clamp(26px, 3.2vw, 44px)" }}>
                {pair.a}
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="h-px w-10 bg-white/15" />
                <div className="h-px w-16" style={{ backgroundColor: ACID }} />
              </div>

              <div className="mt-4 text-white/90 font-bold tracking-[-0.02em]" style={{ fontSize: "clamp(26px, 3.2vw, 44px)" }}>
                {pair.b}
              </div>

              {i === 0 && (
                <div className="mt-6 text-white/35 text-xs tracking-[0.35em] uppercase">(keep going)</div>
              )}
            </motion.div>
          ))}

          <motion.div
            className="text-white/55 text-sm tracking-[0.25em] uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: prefersReduced ? 0 : 0.3 }}
          >
            <span className="relative">
              finishing
              <span
                className="absolute left-0 right-0 top-1/2 h-0.5"
                style={{ backgroundColor: ACID, transform: "translateY(-50%) rotate(-2deg)" }}
              />
            </span>{" "}
            is convenient.
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const directions = [
  { title: "BRAND", hint: "pressure identity", items: ["strategy", "identity", "systems", "naming"] },
  { title: "DIGITAL", hint: "interfaces that bite", items: ["web", "product", "motion", "conversion"] },
  { title: "SYSTEMS", hint: "structure over vibes", items: ["process", "automation", "ops", "documentation"] },
  { title: "AI", hint: "useful, not cute", items: ["agents", "workflows", "assistants", "integrations"] },
  { title: "EXPERIMENTS", hint: "unfinished on purpose", items: ["prototypes", "tests", "fragments", "research"] },
];

function Lab() {
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="h-full w-full flex items-center">
      <div className="ml-[max(24px,6vw)] mr-[max(24px,6vw)] w-full">
        <div className="max-w-245">
          <div className="text-white/55 text-xs tracking-[0.35em] uppercase">LAB / DIRECTIONS</div>

          <div className="space-y-5">
            {directions.map((d) => {
              const isOpen = open === d.title;
              const isHover = hovered === d.title;

              return (
                <div key={d.title} className="border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() => setOpen((prev) => (prev === d.title ? null : d.title))}
                    onMouseEnter={() => setHovered(d.title)}
                    onMouseLeave={() => setHovered(null)}
                    className="w-full text-left flex items-baseline justify-between gap-6 group select-none"
                  >
                    <motion.div
                      className="text-white font-extrabold tracking-[-0.03em]"
                      style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
                      animate={prefersReduced ? {} : { x: isHover ? 4 : 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      {d.title}
                    </motion.div>

                    <motion.div
                      className="font-bold tracking-[-0.02em]"
                      animate={prefersReduced ? {} : { x: isHover ? 6 : 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ color: ACID, fontSize: "clamp(22px, 3vw, 44px)" }}
                      aria-hidden
                    >
                      →
                    </motion.div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                    transition={{ duration: prefersReduced ? 0 : 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 pb-2">
                      <div
                        className={cx(
                          "mb-5 text-white/35 text-xs tracking-[0.35em] uppercase transition-opacity opacity-100"
                        )}
                      >
                        ({d.hint})
                      </div>
                      <div className="flex flex-col flex-wrap gap-x-10 gap-y-2">
                        {d.items.map((it) => (
                          <div key={it} className="text-white/80 text-sm tracking-[0.18em] uppercase">
                            {it}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* <div className="mt-10 text-white/30 text-xs tracking-[0.35em] uppercase">
            menu appears here. not earlier.
          </div> */}
        </div>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="h-full w-full flex items-center">
      <FeedbackForm />
    </div>
  )
}

/* ----------------------------- page ------------------------------ */

export default function Page() {
  const sectionIds = ["hero", "manifest", "lab", "form", "footer"] as const;
  type SectionId = (typeof sectionIds)[number];

  const { refs } = useActiveSection(sectionIds);

  // const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: SectionId) => {
    const el = refs.get(id)?.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <NDGGCursor />

      <div className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
        <section ref={refs.get("hero")} data-section="hero" className="h-svh snap-start snap-always relative">
          <Hero onScrollNext={() => scrollTo("manifest")} />
        </section>

        <section ref={refs.get("manifest")} data-section="manifest" className="h-svh snap-start snap-always relative">
          <Manifest />
        </section>

        <section ref={refs.get("lab")} data-section="lab" className="h-svh snap-start snap-always relative">
          <Lab />
        </section>

        <section ref={refs.get("form")} data-section="form" className="h-svh snap-start snap-always relative flex">
          <Form />
        </section>

        <section ref={refs.get("footer")} data-section="footer"  className="h-svh snap-start snap-always relative flex items-center">
          <SiteFooter />
        </section>
      </div>
    </main>
  );
}
