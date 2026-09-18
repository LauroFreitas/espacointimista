"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { Logo } from "@/components/logo";

export function Header() {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 20);

    if (current > previous && current > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[70]"
      animate={{
        y: hidden ? -140 : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.3, ease: "easeInOut" }
      }
      style={{ pointerEvents: hidden ? "none" : "auto" }}
    >
      <div
        className={`transition-colors duration-500 ${
          scrolled
            ? "bg-espresso/92 shadow-[0_10px_40px_rgba(36,30,26,0.28)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center px-6 md:h-[5.5rem] md:px-8">
          <a href="#topo" className="text-ivory">
            <Logo />
          </a>
        </div>
      </div>
    </motion.header>
  );
}
