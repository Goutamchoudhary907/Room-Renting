import type { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

interface RevealProps {
  children: ReactNode;
  /** animation-delay in seconds, matches the design's staggered fade-up timing */
  delay?: number;
  className?: string;
  as?: "div" | "span";
}

/**
 * Fades + slides content up once it scrolls into view, mirroring the
 * `fadeUp` entrance animation used throughout the Rentpy redesign.
 */
export const Reveal = ({ children, delay = 0, className = "", as = "div" }: RevealProps) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      className={`${inView ? "animate-rp-fade-up" : "opacity-0"} ${className}`}
      style={{ animationDelay: inView ? `${delay}s` : undefined }}
    >
      {children}
    </Tag>
  );
};
