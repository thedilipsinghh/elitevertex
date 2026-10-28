"use client";

import React, { useEffect, useRef, useState, useId } from "react";

export type AnimationDirection = "up" | "down" | "left" | "right" | "fade" | "scale";

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  direction?: AnimationDirection;
  delay?: number; // milliseconds
  duration?: number; // milliseconds
  distance?: number; // pixels
  className?: string;
  as?: React.ElementType;
  once?: boolean;
  threshold?: number;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  distance = 24,
  className = "",
  as: Component = "div",
  once = true,
  threshold = 0.12,
  style,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    setHasRendered(true);

    const element = ref.current;
    if (!element) return;

    // Check prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    // Check if element is already within viewport on initial load (e.g. above the fold)
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      if (once) return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, threshold]);

  const getTransform = () => {
    if (isVisible) return "none";
    switch (direction) {
      case "up":
        return `translateY(${distance}px)`;
      case "down":
        return `translateY(-${distance}px)`;
      case "left":
        return `translateX(${distance}px)`;
      case "right":
        return `translateX(-${distance}px)`;
      case "scale":
        return "scale(0.95)";
      case "fade":
      default:
        return "none";
    }
  };

  const dynamicStyle: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: isVisible ? "auto" : "opacity, transform",
    ...style,
  };

  return (
    <Component
      ref={ref}
      className={className}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Helper container for staggering multiple child elements sequentially
 */
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 80,
  baseDelay = 0,
  direction = "up",
  as: Component = "div",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
  direction?: AnimationDirection;
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>) {
  const childrenArray = React.Children.toArray(children);

  return (
    <Component className={className} {...props}>
      {childrenArray.map((child, index) => (
        <ScrollReveal
          key={index}
          direction={direction}
          delay={baseDelay + index * staggerDelay}
        >
          {child}
        </ScrollReveal>
      ))}
    </Component>
  );
}
