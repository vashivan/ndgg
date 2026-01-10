"use client";

import { motion, AnimatePresence } from "framer-motion";

const ACID = "#FF1E1E";

type SectionId = "hero" | "manifest" | "lab" | "work";

export default function NDGGMenuOverlay({
  canOpen,
  open,
  onToggle,
  onGo,
}: {
  canOpen: boolean; // true тільки на 3 екрані
  open: boolean;
  onToggle: () => void;
  onGo: (id: SectionId) => void;
}) {
  const items: Array<{ id: SectionId; label: string; sub: string }> = [
    { id: "hero", label: "HOME", sub: "not done. go further." },
    { id: "manifest", label: "MANIFEST", sub: "fragments of pressure" },
    { id: "lab", label: "LAB", sub: "directions & systems" },
    { id: "work", label: "WORK", sub: "experiments / fragments" },
  ];

  return (
    <>
      {/* тригер (показується тільки на 3 екрані) */}
      <div className="fixed top-6 right-6 z-50">
        <button
          type="button"
          onClick={onToggle}
          disabled={!canOpen}
          className={[
            "select-none rounded-xl px-3 py-2 border backdrop-blur transition",
            canOpen
              ? "border-white/15 bg-black/40 hover:border-white/30"
              : "border-white/5 bg-black/20 opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <span style={{ color: ACID }} className="text-[12px] tracking-[0.28em] uppercase">
            menu
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-60 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.22 } }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
          >
            {/* top bar */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
              <div className="text-white/60 text-xs tracking-[0.35em] uppercase">NDGG</div>

              <button
                type="button"
                onClick={onToggle}
                className="px-3 py-2 rounded-xl border border-white/10 hover:border-white/25 transition"
              >
                <span className="text-white/70 text-[12px] tracking-[0.28em] uppercase">
                  close
                  <span style={{ color: ACID }}> ×</span>
                </span>
              </button>
            </div>

            {/* menu content */}
            <div className="h-full w-full flex items-center">
              <div className="ml-[max(24px,6vw)] mr-[max(24px,6vw)] w-full">
                <div className="max-w-245">
                  <div className="text-white/35 text-xs tracking-[0.35em] uppercase mb-10">
                    navigation
                  </div>

                  <div className="space-y-6">
                    {items.map((it) => (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => {
                          onGo(it.id);
                          onToggle();
                        }}
                        className="group w-full text-left"
                      >
                        <div className="flex items-baseline justify-between gap-6">
                          <div
                            className="text-white font-extrabold tracking-[-0.03em] leading-[0.9]"
                            style={{ fontSize: "clamp(40px, 6.5vw, 92px)" }}
                          >
                            {it.label}
                          </div>

                          <div
                            className="font-bold tracking-[-0.02em]"
                            style={{ color: ACID, fontSize: "clamp(18px, 2.4vw, 36px)" }}
                            aria-hidden
                          >
                            →
                          </div>
                        </div>

                        {/* underline: кислотний */}
                        <div className="mt-4 h-px bg-white/10 w-full" />
                        <div
                          className="h-px w-0 group-hover:w-full transition-[width] duration-300"
                          style={{ backgroundColor: ACID }}
                        />

                        <div className="mt-3 text-white/40 text-xs tracking-[0.35em] uppercase group-hover:text-white/60 transition">
                          {it.sub}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-12 text-white/25 text-xs tracking-[0.35em] uppercase">
                    not everything should be visible.
                  </div>
                </div>
              </div>
            </div>

            {/* ESC */}
            <div className="absolute bottom-6 left-6 text-white/25 text-xs tracking-[0.35em] uppercase">
              press <span style={{ color: ACID }}>esc</span> to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
