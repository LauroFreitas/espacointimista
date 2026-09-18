"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { HopButton } from "@/components/hop-button";

export function HeroBanner() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollY } = useScroll();
  const progress = useMotionValue(0);

  const updateProgress = () => {
    const el = containerRef.current;
    if (!el) return;

    const distance = el.offsetHeight - window.innerHeight;
    if (distance <= 0) {
      progress.set(0);
      return;
    }

    progress.set(
      Math.min(1, Math.max(0, -el.getBoundingClientRect().top / distance)),
    );
  };

  useMotionValueEvent(scrollY, "change", updateProgress);

  useEffect(() => {
    updateProgress();
    window.addEventListener("resize", updateProgress);
    return () => window.removeEventListener("resize", updateProgress);
    // Motion values and the section ref stay stable for the lifetime of this component.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync once and on resize
  }, []);

  const scale = useTransform(progress, [0, 0.88], [1, 1.45]);
  const filter = useTransform(progress, [0, 0.8], ["blur(0px)", "blur(28px)"]);
  const fadeOut = useTransform(progress, [0, 0.4, 0.88], [1, 1, 0]);
  const contentY = useTransform(progress, [0, 0.88], [0, -48]);
  const layerVisibility = useTransform(progress, (value) =>
    value >= 0.88 ? "hidden" : "visible",
  );

  return (
    <section
      ref={containerRef}
      className={`relative z-10 ${reducedMotion ? "min-h-svh" : "h-[200vh]"}`}
    >
      <div className="sticky top-0 isolate z-10 h-svh overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-ivory"
          style={reducedMotion ? undefined : { visibility: layerVisibility }}
        />
        <motion.div
          className="absolute inset-0"
          style={
            reducedMotion
              ? undefined
              : { opacity: fadeOut, visibility: layerVisibility }
          }
        >
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={
              reducedMotion
                ? undefined
                : { scale, filter, transformOrigin: "center center" }
            }
          >
            <Image
              src="https://images.unsplash.com/photo-1745327883290-1e9c6447b938?auto=format&fit=crop&w=2400&q=80"
              alt="Sala de massagem pronta para atendimento, com maca e toalhas"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>

          <div className="absolute inset-0 bg-white/80" />
          <div className="grain pointer-events-none absolute inset-0 z-[1]" />
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center text-ink md:px-8"
          style={
            reducedMotion
              ? undefined
              : { opacity: fadeOut, y: contentY, visibility: layerVisibility }
          }
        >
            <h1 className="flex flex-col items-center">
              <Image
                src="/logo-espaco-intimista.png"
                alt="Espaço Intimista"
                width={3840}
                height={1558}
                priority
                quality={100}
                unoptimized
                className="h-auto w-[min(86vw,42rem)]"
              />
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-ink/80 md:text-xl">
              Um ambiente calmo para cuidar do corpo. Atendimento individual, com
              hora marcada.
            </p>
            <HopButton
              href="#terapias"
              className="mt-10 inline-flex w-fit bg-gold px-7 py-3.5 text-base font-medium text-espresso transition-colors hover:bg-gold-soft"
            >
              Ver terapias
            </HopButton>
        </motion.div>
      </div>
    </section>
  );
}
