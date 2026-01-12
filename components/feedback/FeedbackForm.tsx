"use client";

import React, { useMemo, useState } from "react";

const ACID = "#FF1E1E";

type FormState = {
  name: string;
  contact: string;
  message: string;
  website: string; // honeypot
};

type Status =
  | { type: "idle" }
  | { type: "sending" }
  | { type: "success"; text: string }
  | { type: "error"; text: string };

export default function FeedbackForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    contact: "",
    message: "",
    website: "",
  });

  const [status, setStatus] = useState<Status>({ type: "idle" });

  const canSubmit = useMemo(() => {
    if (status.type === "sending") return false;
    if (form.website.trim().length > 0) return false; // bot
    return form.message.trim().length >= 8;
  }, [form.message, form.website, status.type]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setStatus({ type: "sending" });

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          contact: form.contact.trim(),
          message: form.message.trim(),
          website: form.website, // honeypot
        }),
      });

      const data: unknown = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          typeof (data as { error?: string })?.error === "string"
            ? (data as { error?: string }).error!
            : "Something broke. Try again.";
        setStatus({ type: "error", text: msg });
        return;
      }

      setForm({ name: "", contact: "", message: "", website: "" });
      setStatus({ type: "success", text: "Sent. We’ll come back with pressure." });
    } catch {
      setStatus({ type: "error", text: "Network error. Try again." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="text-white/55 text-xs tracking-[0.35em] uppercase">
        feedback / contact
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <div className="text-white/35 text-xs tracking-[0.35em] uppercase mb-2">
            name (optional)
          </div>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full border-b border-white/10 bg-white/8 px-4 py-3 text-white/90 outline-none focus:border-white/25 transition"
            placeholder="NAME"
            autoComplete="name"
          />
        </label>

        <label className="block">
          <div className="text-white/35 text-xs tracking-[0.35em] uppercase mb-2">
            contact (email / telegram)
          </div>
          <input
            value={form.contact}
            onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))}
            className="w-full border-b border-white/10 bg-white/8 px-4 py-3 text-white/90 outline-none focus:border-white/25 transition"
            placeholder="email or @handle"
            autoComplete="email"
          />
        </label>
      </div>

      <label className="block mt-4">
        <div className="text-white/35 text-xs tracking-[0.35em] uppercase mb-2">
          message
        </div>
        <textarea
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          className="min-h-35 w-full border-b border-white/10 bg-white/8 px-4 py-3 text-white/90 outline-none focus:border-white/25 transition resize-none"
          placeholder="What do you need built? What’s the pressure?"
        />
      </label>

      {/* honeypot */}
      <div className="sr-only" aria-hidden>
        <label>
          Website
          <input
            value={form.website}
            onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-5 py-3 bg-white/3 hover:border-white/25 transition disabled:opacity-40 disabled:hover:border-white/10"
        >
          <span className="text-[12px] tracking-[0.28em] uppercase text-white/85">
            send<span style={{ color: ACID }}> →</span>
          </span>
        </button>

        {status.type === "sending" && (
          <div className="text-white/35 text-xs tracking-[0.35em] uppercase">
            sending…
          </div>
        )}
        {status.type === "success" && (
          <div className="text-white/55 text-xs tracking-[0.35em] uppercase">
            <span style={{ color: ACID }}>✓</span> {status.text}
          </div>
        )}
        {status.type === "error" && (
          <div className="text-white/55 text-xs tracking-[0.35em] uppercase">
            <span style={{ color: ACID }}>×</span> {status.text}
          </div>
        )}
      </div>

      <div className="mt-6 h-px w-full bg-white/10" />
      <div className="mt-2 h-px w-[60%]" style={{ backgroundColor: ACID }} />
    </form>
  );
}
