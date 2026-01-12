// app/api/feedback/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // важливо для nodemailer у Next.js (App Router)

const feedbackSchema = z.object({
  name: z.string().trim().max(100).optional().default(""),
  contact: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().min(8).max(5000),
  website: z.string().optional().default(""), // honeypot, валідний як строка
});

function bool(v: string | undefined, fallback = false) {
  if (v == null) return fallback;
  return v === "1" || v.toLowerCase() === "true" || v.toLowerCase() === "yes";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const feedback = feedbackSchema.parse(body);

    // honeypot (якщо заповнено — тихо "ок", щоб бот не ретраїв)
    if (feedback.website.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT ?? "587");
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    const to = process.env.FEEDBACK_RECEIVER_EMAIL || process.env.EMAIL_TO;
    const from = process.env.EMAIL_FROM || user; // бажано hello@ndgg.studio

    if (!host || !user || !pass || !to || !from) {
      return NextResponse.json(
        { error: "Email env vars are not configured." },
        { status: 500 }
      );
    }

    // secure only for 465. For 587 use STARTTLS (secure: false)
    const secure = port === 465 ? true : bool(process.env.EMAIL_SECURE, false);

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      // для STARTTLS на 587
      requireTLS: port === 587,
      // інколи на серверлес/деяких SMTP це рятує від TLS-хитань
      tls: {
        minVersion: "TLSv1.2",
      },
    });

    const subject = "NDGG — New feedback";
    const text = [
      `Name: ${feedback.name || "—"}`,
      `Contact: ${feedback.contact || "—"}`,
      ``,
      `Message:`,
      feedback.message,
    ].join("\n");

    await transporter.sendMail({
      from: `NDGG <${from}>`,
      to,
      subject,
      text,
      replyTo: feedback.contact || undefined, // якщо залишили email/handle
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    // Zod -> 400, інше -> 500
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid payload.", details: err.flatten() },
        { status: 400 }
      );
    }

    console.error("Error processing feedback:", err);
    return NextResponse.json(
      { error: "Failed to process feedback." },
      { status: 500 }
    );
  }
}
