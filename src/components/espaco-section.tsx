"use client";

import Image from "next/image";
import { Fragment, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

const START_OPACITY = 0.15;
const SPREAD = 0.8;
const WORD_DURATION = 0.2;

export interface WordProgressRange {
  start: number;
  end: number;
}

export function getWordProgressRange(
  index: number,
  count: number,
): WordProgressRange {
  const start = count <= 1 ? 0 : (index / (count - 1)) * SPREAD;

  return {
    start,
    end: Math.min(1, start + WORD_DURATION),
  };
}

export function getWordOpacity(
  progress: number,
  { start, end }: WordProgressRange,
  startOpacity = START_OPACITY,
): number {
  if (progress <= start) return startOpacity;
  if (progress >= end) return 1;

  const wordProgress = (progress - start) / (end - start);
  return startOpacity + (1 - startOpacity) * wordProgress;
}

function Word({
  children,
  progress,
  index,
  count,
  reducedMotion,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  count: number;
  reducedMotion: boolean;
}) {
  const range = getWordProgressRange(index, count);
  const opacity = useTransform(progress, (latest) =>
    getWordOpacity(latest, range),
  );

  return (
    <motion.span
      aria-hidden="true"
      style={reducedMotion ? undefined : { opacity }}
    >
      {children}
    </motion.span>
  );
}

function ScrollWords({
  text,
  progress,
  startIndex,
  totalCount,
  reducedMotion,
}: {
  text: string;
  progress: MotionValue<number>;
  startIndex: number;
  totalCount: number;
  reducedMotion: boolean;
}) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word}-${startIndex + index}`}>
          <Word
            progress={progress}
            index={startIndex + index}
            count={totalCount}
            reducedMotion={reducedMotion}
          >
            {word}
          </Word>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

const HEADING = "Um lugar reservado, só para a sua sessão.";
const BODY_ONE =
  "Luz baixa, silêncio e atendimento com hora marcada. Você chega, a sala já está pronta e não precisa esperar.";
const BODY_TWO = "Sem fila. Sem pressa. Cada horário é exclusivo.";

const HEADING_WORDS = HEADING.split(" ").length;
const BODY_ONE_WORDS = BODY_ONE.split(" ").length;
const TOTAL_WORDS =
  HEADING_WORDS + BODY_ONE_WORDS + BODY_TWO.split(" ").length;

export function EspacoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      id="espaco"
      className={`relative z-0 min-h-[220vh] scroll-mt-32 bg-ivory ${
        reducedMotion ? "" : "-mt-[100svh]"
      }`}
      aria-labelledby="espaco-heading"
    >
      <div className="sticky top-0 flex min-h-svh items-center overflow-hidden px-6 py-24 md:px-8">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-20">
          <div className="relative">
            <div className="absolute top-5 -right-4 hidden h-full w-full border border-sand md:block" />
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=80"
                alt="Óleos e toalhas em uma sala de massagem"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
          </div>

          <div className="grid items-start gap-10 md:grid-cols-[1px_minmax(0,1fr)]">
            <div
              className="relative hidden h-28 overflow-hidden bg-sand md:block"
              aria-hidden="true"
            >
              <motion.span
                className="absolute inset-0 origin-top bg-espresso"
                style={{ scaleY: reducedMotion ? 1 : scrollYProgress }}
              />
            </div>

            <div className="max-w-md">
              <p className="text-sm font-medium tracking-[0.16em] uppercase text-rose">
                O espaço
              </p>
              <h2
                id="espaco-heading"
                className="mt-3 font-display text-3xl leading-snug font-semibold text-balance md:text-4xl"
                aria-label={HEADING}
              >
                <ScrollWords
                  text={HEADING}
                  progress={scrollYProgress}
                  startIndex={0}
                  totalCount={TOTAL_WORDS}
                  reducedMotion={reducedMotion}
                />
              </h2>
              <p className="mt-6 text-lg leading-8 text-stone" aria-label={BODY_ONE}>
                <ScrollWords
                  text={BODY_ONE}
                  progress={scrollYProgress}
                  startIndex={HEADING_WORDS}
                  totalCount={TOTAL_WORDS}
                  reducedMotion={reducedMotion}
                />
              </p>
              <p className="mt-4 text-lg leading-8 text-stone" aria-label={BODY_TWO}>
                <ScrollWords
                  text={BODY_TWO}
                  progress={scrollYProgress}
                  startIndex={HEADING_WORDS + BODY_ONE_WORDS}
                  totalCount={TOTAL_WORDS}
                  reducedMotion={reducedMotion}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
