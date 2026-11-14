import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger offset in ms. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Marks a block to rise in once, the first time it enters the screen. This is
 * plain markup: one observer for the whole page (PageFx) adds the class that
 * triggers the CSS transition, so a reveal costs no component and no script
 * of its own. Without JavaScript or with reduced motion it is simply visible.
 */
export function Reveal({ children, delay = 0, as: Tag = "div", className = "" }: RevealProps) {
  return (
    <Tag className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
