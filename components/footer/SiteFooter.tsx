"use client";

const ACID = "#FF1E1E";

export default function SiteFooter() {
  return (
    <footer>
      <div className="px-[max(24px,6vw)] py-14">
        <div className="max-w-275">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_560px] gap-10 items-start">
            <div>

              <div className="mt-5 text-white font-extrabold tracking-[-0.03em] leading-[0.95]" style={{ fontSize: "clamp(28px, 3.6vw, 54px)" }}>
                NOT DONE<span style={{ color: ACID }}>.</span>
                <br />
                GO FURTHER<span style={{ color: ACID }}>.</span>
              </div>

              <div className="mt-6 text-white/45 text-xs tracking-[0.35em] uppercase max-w-[52ch]">
                No clients on display. No case studies. Only structure, pressure, and systems.
              </div>

              <div className="mt-10 flex items-center gap-3 text-white/35 text-xs tracking-[0.35em] uppercase">
                <span>© {new Date().getFullYear()}</span>
                <span className="h-px w-10 bg-white/10" />
                <span className="text-white/55">NDGG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* subtle acid fog */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          background:
            "radial-gradient(900px 320px at 15% 30%, rgba(255,30,30,0.10), transparent 60%)",
        }}
      />
    </footer>
  );
}
