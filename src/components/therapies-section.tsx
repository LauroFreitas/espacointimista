"use client";

import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { HopButton } from "@/components/hop-button";
import { whatsappUrl } from "@/lib/whatsapp";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const therapies = [
  {
    title: "Escalda-pés",
    duration: "30 minutos",
    description:
      "Imersão dos pés em água morna, com ervas e sais. Alivia o cansaço e ajuda o corpo a relaxar.",
    image: "/escalda-pes.jpg",
  },
  {
    title: "Massagem Facial",
    duration: "40 minutos",
    description:
      "Massagem suave no rosto, pescoço e couro cabeludo. Solta a tensão e suaviza a expressão.",
    image: "/massagem-facial.jpg",
  },
  {
    title: "Massagem Relaxante",
    duration: "60 minutos",
    description:
      "Massagem em todo o corpo, com óleos quentes. Ajuda a soltar a musculatura e relaxar.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Terapia de Pedras Quentes",
    duration: "80 minutos",
    description:
      "Pedras de basalto aquecidas nas costas e nos pontos de tensão. O calor relaxa mais fundo.",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80",
  },
];

const WHATSAPP_URL = whatsappUrl(
  "Olá! Quero fazer a minha anamnese e agendar um horário. O profissional avalia e indica o cuidado que eu preciso.",
);
const GAP = 18;
const SLIDE_MS = 4200;
const slides = [...therapies, ...therapies];
const REAL_COUNT = therapies.length;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function logicalIndex(value: number) {
  return ((Math.round(value) % REAL_COUNT) + REAL_COUNT) % REAL_COUNT;
}

function itemWidth(
  index: number,
  position: number,
  wide: number,
  narrow: number,
) {
  const dist = Math.min(Math.abs(position - index), 1);
  const mix = (1 + Math.cos(dist * Math.PI)) / 2;
  return narrow + (wide - narrow) * mix;
}

function trackOffset(
  position: number,
  count: number,
  wide: number,
  narrow: number,
) {
  const widths = Array.from({ length: count }, (_, index) =>
    itemWidth(index, position, wide, narrow),
  );
  const lefts: number[] = [];
  let x = 0;
  for (let index = 0; index < count; index += 1) {
    lefts.push(x);
    x += widths[index] + GAP;
  }

  const from = Math.min(count - 1, Math.max(0, Math.floor(position)));
  const to = Math.min(count - 1, from + 1);
  const t = position - from;
  const focusLeft = lefts[from] + (lefts[to] - lefts[from]) * t;
  return Math.min(0, -focusLeft);
}

function Slide({
  therapy,
  index,
  position,
  wide,
  narrow,
  height,
  onSelect,
}: {
  therapy: (typeof therapies)[number];
  index: number;
  position: MotionValue<number>;
  wide: number;
  narrow: number;
  height: number;
  onSelect: (index: number) => void;
}) {
  const width = useTransform(position, (value) =>
    itemWidth(index, value, wide, narrow),
  );

  return (
    <motion.button
      type="button"
      aria-label={therapy.title}
      onClick={() => onSelect(index)}
      className="relative shrink-0 overflow-hidden rounded-[1.35rem] bg-espresso"
      style={{ width, height }}
    >
      <Image
        src={therapy.image}
        alt={therapy.title}
        fill
        draggable={false}
        className="pointer-events-none object-cover"
        sizes="(min-width: 768px) 70vw, 85vw"
      />
    </motion.button>
  );
}

export function TherapiesSection() {
  const reducedMotion = Boolean(useReducedMotion());
  const viewportRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const elapsedRef = useRef(0);
  const wrappingRef = useRef(false);
  const progressAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const pointerRef = useRef<{ id: number; x: number; position: number } | null>(
    null,
  );
  const position = useMotionValue(0);
  const timer = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [metrics, setMetrics] = useState({
    width: 960,
    height: 400,
    wide: 720,
    narrow: 280,
  });

  const x = useTransform(position, (value) =>
    trackOffset(value, slides.length, metrics.wide, metrics.narrow),
  );

  const wrapLoop = useCallback(() => {
    const value = position.get();
    if (value >= REAL_COUNT) {
      progressAnimRef.current?.stop();
      wrappingRef.current = true;
      position.set(value - REAL_COUNT);
      wrappingRef.current = false;
    }
  }, [position]);

  const measure = useCallback(() => {
    const node = viewportRef.current;
    if (!node) return;
    const width = node.clientWidth;
    const height = Math.round(
      clamp(width * (width < 720 ? 0.64 : 0.36), 240, 400),
    );
    const wide = Math.round(
      clamp(width * (width < 720 ? 0.88 : 0.76), 240, width - 28),
    );
    const narrow = Math.round(clamp(height * 0.82, 170, wide * 0.4));
    setMetrics({ width, height, wide, narrow });
  }, []);

  useEffect(() => {
    measure();
    const node = viewportRef.current;
    if (!node) return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure]);

  useMotionValueEvent(position, "change", (value) => {
    if (wrappingRef.current) return;
    const next = logicalIndex(value);
    setActive((current) => (current === next ? current : next));
  });

  const goTo = useCallback(
    (index: number) => {
      elapsedRef.current = 0;
      timer.set(0);
      progressAnimRef.current?.stop();
      const current = position.get();
      let target = index;
      if (target < current - 0.4) target += REAL_COUNT;
      target = clamp(target, 0, slides.length - 1);
      progressAnimRef.current = animate(position, target, {
        type: "spring",
        visualDuration: 0.7,
        bounce: 0,
        onComplete: wrapLoop,
      });
    },
    [position, timer, wrapLoop],
  );

  const snap = useCallback(() => {
    goTo(Math.round(position.get()));
  }, [goTo, position]);

  useEffect(() => {
    if (reducedMotion) return;

    let frame = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      wrapLoop();

      if (!pausedRef.current && !pointerRef.current) {
        elapsedRef.current += delta;
        const amount = Math.min(1, elapsedRef.current / SLIDE_MS);
        timer.set(amount);

        if (amount >= 1) {
          elapsedRef.current = 0;
          timer.set(0);
          const current = Math.round(position.get());
          progressAnimRef.current?.stop();
          progressAnimRef.current = animate(position, current + 1, {
            type: "spring",
            visualDuration: 0.7,
            bounce: 0,
            onComplete: wrapLoop,
          });
        }
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [position, reducedMotion, timer, wrapLoop]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node || reducedMotion) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      progressAnimRef.current?.stop();
      position.set(
        clamp(position.get() + event.deltaX / (metrics.width * 1.8), 0, REAL_COUNT),
      );
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [metrics.width, position, reducedMotion]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    pausedRef.current = true;
    progressAnimRef.current?.stop();
    pointerRef.current = {
      id: event.pointerId,
      x: event.clientX,
      position: position.get(),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    const delta = (pointer.x - event.clientX) / (metrics.width * 0.72);
    position.set(clamp(pointer.position + delta, 0, REAL_COUNT));
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointerRef.current || pointerRef.current.id !== event.pointerId) return;
    pointerRef.current = null;
    snap();
    pausedRef.current = false;
  };

  const therapy = therapies[active];

  return (
    <section
      id="terapias"
      className="relative scroll-mt-32 overflow-x-hidden bg-plum py-24 text-ivory md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="text-sm font-medium text-gold-soft">Terapias</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold md:text-4xl">
          Escolha a terapia que combina com o seu tempo.
        </h2>

        <div
          ref={viewportRef}
          className="relative mt-10 cursor-grab touch-pan-y overflow-hidden py-2 active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <motion.div
            className="flex items-center"
            style={{ x, gap: GAP, height: metrics.height }}
          >
            {slides.map((item, index) => (
              <Slide
                key={`${item.title}-${index}`}
                therapy={item}
                index={index}
                position={position}
                wide={metrics.wide}
                narrow={metrics.narrow}
                height={metrics.height}
                onSelect={goTo}
              />
            ))}
          </motion.div>
        </div>

        <div
          className="relative mt-8 h-[3px] w-36 overflow-hidden rounded-full bg-ivory/20"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-y-0 left-0 origin-left bg-ivory"
            style={{ scaleX: timer, width: "100%" }}
          />
        </div>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-xl" aria-live="polite">
            <p className="text-sm font-medium text-gold-soft">{therapy.duration}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold leading-snug">
              {therapy.title}
            </h3>
            <p className="mt-3 text-base leading-7 text-ivory/90">
              {therapy.description}
            </p>
          </div>

          <HopButton
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center bg-gold px-8 py-4 text-lg font-medium text-espresso transition-colors hover:bg-gold-soft md:px-10 md:py-5 md:text-xl"
          >
            Quero o meu cuidado
          </HopButton>
        </div>
      </div>
    </section>
  );
}
