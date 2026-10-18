"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary";

const baseClasses =
  "inline-flex items-center justify-center px-8 py-4 rounded-full font-outfit text-sm font-semibold " +
  "transition-all duration-200 transform active:scale-95 disabled:opacity-40 disabled:pointer-events-none " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-violet";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-neon-violet to-neon-pink-deep text-white hover:opacity-90 hover:scale-[1.02] " +
    "shadow-lg shadow-neon-violet/20",
  secondary:
    "bg-transparent border border-white/15 text-paper-100 " +
    "hover:bg-white/5 hover:border-white/30 hover:scale-[1.02]",
};

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Single button component for the whole app. Renders a real <button> for
 * actions, or a Next.js <Link> when given an href — never mix the two by
 * hand in a page again. Matches the two pill styles that appear identically
 * across every Stitch screen (solid primary, outlined secondary).
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = "primary", children, className = "", ...props }, ref) => {
    const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

    if ("href" in props && props.href) {
      const { href, ...anchorProps } = props as ButtonAsLink;
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...anchorProps}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(props as ButtonAsButton)}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
