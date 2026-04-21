"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import SiteFooter from "@/components/footer/SiteFooter";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import Link from "next/link";
import { link } from "fs";

const ACID = "#FF1E1E";

const services = [
  {
    number: "01",
    title: "Web Design & Development",
    text: "Створюємо нові сайти або переосмислюємо існуючі: структура, дизайн, верстка, анімація, запуск.",
  },
  {
    number: "02",
    title: "Brand Presence",
    text: "Допомагаємо бренду виглядати цілісно: візуальна подача, тексти, позиціонування, цифровий образ.",
  },
  {
    number: "03",
    title: "Portfolio & Case Presentation",
    text: "Оформлюємо проєкти так, щоб вони не просто існували, а переконували: кейси, сторінки, подача результату.",
  },
  {
    number: "04",
    title: "Digital Systems",
    text: "Підключаємо форми, автоматизації, CRM-логіку, AI-інструменти й інші робочі механіки під бізнес-задачі.",
  },
];

const projects = [
  {
    name: "FORM",
    type: "E-commerce / Brand site",
    description:
      "Оновлення структури й подачі бренду танцювального одягу: каталог, сторінки товарів, візуальна система, сучасніший UX.",
    tags: ["Next.js", "Tailwind", "E-commerce", "MySQL", "Prisma"],
    link: "https://formdance.space/"
  },
  {
    name: "CASTPOINT",
    type: "Platform / Product presentation",
    description:
      "Платформа для артистів і роботодавців. Пропрацювання логіки вакансій, заявок, PDF-подачі кандидатів і загального цифрового образу сервісу.",
    tags: ["Platform", "UX", "Automation", "Brand", "Visual concept"],
    link: "https://castpoint.art"
  },
  {
    name: "Seoul memo",
    type: "Concept store / Storytelling",
    description:
      "Емоційний e-commerce-проєкт із сильним mood-driven підходом. Акцент на атмосфері, історії продукту та відчутті бренду.",
    tags: ["Storytelling", "Brand", "Visual concept", "Neon", "PostgreSQL"],
    link: "https://seoul-memo.vercel.app"
  },
   {
    name: "Lavanda Studio",
    type: "E-commerce / Storytelling",
    description:
      "Проект для аналізу та запису клієнтів студії. Акцент на візуальній подачі та зручності використання, автоматизації процесів без участі менеджера.",
    tags: ["Storytelling", "Brand", "Visual concept", "Neon", "MySQL"],
    link: "https://lavanda-studio.ua"
  }
];

const steps = [
  "Аналізуємо, як зараз виглядає ваш сайт або ідея.",
  "Пропонуємо нову структуру й подачу під ваш продукт.",
  "Збираємо дизайн і front-end реалізацію.",
  "Додаємо проєкти, контент, форми та потрібні інтеграції.",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 text-[11px] uppercase tracking-[0.35em] text-white/45">
      {children}
    </div>
  );
}

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-6 md:px-10 ${className}`}>{children}</div>;
}

function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <Container className="py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.45 }}
              className="mb-5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-white/50"
            >
              <span className="h-px w-10 bg-white/20" />
              NDGG / Product & Brand Presence
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.08 }}
              className="max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-white md:text-7xl xl:text-[92px]"
            >
              We redesign websites so brands look clear, strong and worth choosing
              <span style={{ color: ACID }}>.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.16 }}
              className="mt-8 max-w-2xl text-justify leading-7 text-white/72 md:text-lg"
            >
              Збираємо нові сторінки, переробляємо існуючі сайти й оформлюємо проєкти так,
              щоб сайт став не просто візиткою, а сильною подачею бренду, компанії або студії.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.24 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="#projects"
                className="inline-flex items-center justify-center border border-transparent px-6 py-3 text-sm font-medium text-black transition-transform duration-200 hover:color-white"
                style={{ backgroundColor: ACID }}
              >
                View projects
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center border border-white/15 px-6 py-3 text-sm font-medium text-white/88 transition-colors duration-200 hover:border-white/30 hover:text-white"
              >
                Discuss a project
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.18 }}
          >
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/40">What we do</div>
            <div className="mt-6 space-y-5">
              {[
                "Build new pages",
                "Redesign existing websites",
                "Add company / studio presentation",
                "Showcase selected projects and portfolio",
              ].map((item) => (
                <div key={item} className="flex items-start gap-4 border-b border-white/8 pb-4 last:border-b-0 last:pb-0">
                  <div className="mt-1 h-2 w-2 rounded-full" style={{ backgroundColor: ACID }} />
                  <p className="text-sm uppercase tracking-[0.18em] text-white/78">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>

      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(900px 500px at 15% 10%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(700px 420px at 85% 70%, rgba(255,30,30,0.10), transparent 60%)",
        }}
      />
    </section>
  );
}

function About() {
  return (
    <section id="about" className="border-b border-white/10 py-20 md:py-28">
      <Container>
        <SectionLabel>About</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-5xl">
              Not just a beautiful screen — a clearer digital presence.
            </h2>
          </div>

          <div className="space-y-6 text-justify leading-8 text-white/72">
            <p>
              Ми працюємо на перетині сайту, бренду й подачі. Якщо у вас уже є проєкт,
              але він виглядає застаріло, нечітко або не показує вашу цінність — ми це
              перезбираємо.
            </p>
            <p>
              Якщо потрібно, додаємо нові сторінки: про компанію, послуги, кейси,
              портфоліо, форми зворотного зв’язку, логіку заявок та інші елементи,
              які роблять сайт живим і переконливим.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="border-b border-white/10 py-20 md:py-28">
      <Container>
        <SectionLabel>Services</SectionLabel>
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service) => (
            <motion.article
              key={service.title}
              transition={{ duration: 0.18 }}
              className="border border-white/10 bg-white/[0.02] p-6 md:p-8"
            >
              <div className="text-xs uppercase tracking-[0.32em] text-white/35">{service.number}</div>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-white">
                {service.title}
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 md:text-base">
                {service.text}
              </p>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="border-b border-white/10 py-20 md:py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Selected projects</SectionLabel>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-5xl">
              We add your projects to the site so people can see what stands behind the words.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/58 md:text-base">
            Портфоліо — це не додаток “десь внизу”. Це доказ вашого рівня, стилю й підходу.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.name}
              className="border border-white/10 group bg-white/3 p-6 mb-5 transition-colors duration-200 hover:border-white/30"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                  <Link
                    className="underline"
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.name}
                  </Link>
                </h3>
                <span className="text-[11px] uppercase tracking-[0.24em] text-white/35">Project</span>
              </div>
              <div className="mt-3 text-sm uppercase tracking-[0.18em]" style={{ color: ACID }}>
                {project.type}
              </div>
              <p className="mt-5 text-sm leading-7 text-white/70 md:text-base">
                {project.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/55"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Process() {
  return (
    <section className="border-b border-white/10 py-20 md:py-28">
      <Container>
        <SectionLabel>Process</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-5xl">
              From messy site to structured presentation.
            </h2>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step} className="flex gap-5 border border-white/10 px-5 py-5 md:px-6">
                <div className="text-sm font-medium tracking-[0.22em] text-white/35">
                  0{index + 1}
                </div>
                <p className="text-sm leading-7 text-white/75 md:text-base">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionLabel>Contact</SectionLabel>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-5xl">
              Need a new page, a cleaner site, or a proper portfolio section?
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/68">
              Напиши коротко про свій сайт або ідею — і ми подивимось, як це можна
              перетворити на сильнішу й сучаснішу подачу.
            </p>
          </div>

          <div className="border-white/10 bg-white/[0.03] p-4 md:p-6">
            <FeedbackForm />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen text-white">
      <Hero />
      <About />
      <Services />
      <Projects />
      <Process />
      <Contact />
      <SiteFooter />
    </main>
  );
}
