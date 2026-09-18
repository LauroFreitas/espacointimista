"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type HopButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

export function HopButton({
  href,
  children,
  className = "",
  target,
  rel,
}: HopButtonProps) {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      className={className}
      data-hop-button="true"
      initial={{ y: 0 }}
      whileInView={
        reducedMotion
          ? { y: 0 }
          : { y: [0, -8, 0, -4, 0] }
      }
      viewport={{ amount: 0.7, once: false }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              duration: 0.9,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 1.6,
            }
      }
    >
      {children}
    </motion.a>
  );
}
