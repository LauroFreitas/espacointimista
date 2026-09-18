"use client";

import { wrap } from "motion";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, type SVGProps } from "react";

const clients = [
  {
    name: "Marina Costa",
    therapy: "Massagem Relaxante",
    quote: "Saí outra pessoa. A sala é calma e o atendimento é pontual.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Rafael Mendes",
    therapy: "Escalda-pés",
    quote: "Os pés cansados aliviaram. Saí mais leve do que entrei.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Camila Rocha",
    therapy: "Terapia de Pedras Quentes",
    quote: "O calor das pedras nas costas foi o que eu precisava.",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Sofia Almeida",
    therapy: "Massagem Relaxante",
    quote: "Ambiente reservado, sem pressa. Me senti bem cuidada.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Lucas Ferreira",
    therapy: "Massagem Facial",
    quote: "O rosto desinchou e a tensão da testa diminuiu. Quero repetir.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Beatriz Lima",
    therapy: "Terapia de Pedras Quentes",
    quote: "Já indiquei para amigas. Saio descansada de verdade.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=80",
  },
];

const iconProps: SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "22",
  height: "22",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function ArrowLeft() {
  return (
    <svg {...iconProps}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg {...iconProps}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ClientsSection() {
  const [[index, direction], setSlide] = useState([0, 0]);
  const client = clients[index];

  const navigate = (dir: "next" | "prev") => {
    const delta = dir === "next" ? 1 : -1;
    setSlide([wrap(0, clients.length, index + delta), delta]);
  };

  return (
    <section
      id="clientes"
      className="scroll-mt-32 bg-espresso px-6 py-24 text-ivory md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium tracking-[0.16em] uppercase text-gold-soft">
          Clientes
        </p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold md:text-4xl">
          Quem já passou por aqui.
        </h2>

        <div className="mt-14 grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-16">
          <div className="relative flex items-center gap-3 md:gap-4">
            <button
              type="button"
              aria-label="Cliente anterior"
              onClick={() => navigate("prev")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ivory/20 bg-ivory/10 text-ivory transition-colors hover:bg-ivory/20"
            >
              <ArrowLeft />
            </button>

            <div className="relative aspect-[4/5] min-w-0 flex-1 overflow-hidden bg-plum md:aspect-[5/6]">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={index}
                  custom={direction}
                  initial={{ opacity: 0, x: direction >= 0 ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction >= 0 ? -100 : 100 }}
                  transition={{ type: "spring", visualDuration: 0.3, bounce: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={client.image}
                    alt={`${client.name}, cliente do Espaço Intimista`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 420px, 90vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              type="button"
              aria-label="Próximo cliente"
              onClick={() => navigate("next")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ivory/20 bg-ivory/10 text-ivory transition-colors hover:bg-ivory/20"
            >
              <ArrowRight />
            </button>
          </div>

          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <p className="font-display text-2xl leading-snug font-semibold md:text-3xl">
                  “{client.quote}”
                </p>
                <p className="mt-6 text-lg text-ivory">{client.name}</p>
                <p className="mt-1 text-sm text-gold-soft">{client.therapy}</p>
              </motion.div>
            </AnimatePresence>
            <p className="mt-8 text-sm text-ivory/60">
              {index + 1} / {clients.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
