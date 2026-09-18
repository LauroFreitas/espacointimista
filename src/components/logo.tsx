import Image from "next/image";

type LogoProps = {
  className?: string;
  variant?: "header" | "hero" | "footer";
};

export function Logo({ className = "", variant = "header" }: LogoProps) {
  if (variant === "hero") {
    return (
      <span className={`flex flex-col items-start ${className}`}>
        <Image
          src="/logo-mark.png"
          alt=""
          width={148}
          height={148}
          priority
          className="h-24 w-24 rounded-full object-cover md:h-32 md:w-32"
        />
        <span className="mt-6 font-display text-[clamp(2.4rem,5.4vw,4.4rem)] leading-[1.05] font-semibold tracking-tight">
          Espaço Intimista
        </span>
      </span>
    );
  }

  const markClass =
    variant === "footer"
      ? "h-9 w-9 rounded-full object-cover"
      : "h-10 w-10 rounded-full object-cover";

  const textClass =
    variant === "footer"
      ? "font-display text-[1.15rem] font-semibold tracking-tight"
      : "font-display text-[1.15rem] font-semibold tracking-tight";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src="/logo-mark.png"
        alt=""
        width={40}
        height={40}
        className={markClass}
      />
      <span className={textClass}>Espaço Intimista</span>
    </span>
  );
}
