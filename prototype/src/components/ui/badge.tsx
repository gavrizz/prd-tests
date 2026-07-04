import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Copied verbatim from dara-front/src/components/ui/badge.tsx — including the
// severity (critical/high/medium/low) and status (live/paused/ended) variants.
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        critical: "border-transparent bg-surface-theme-light-fail-accent-1 text-text-theme-light-fail-on-base",
        high: "border-transparent bg-orange-50 text-orange-700",
        medium: "border-transparent bg-yellow-50 text-yellow-700",
        low: "border-transparent bg-color-info-50 text-brand",
        live: "border-transparent bg-surface-theme-light-success-accent-1 text-text-theme-light-success-on-base",
        paused: "border-transparent bg-amber-50 text-chocolate",
        ended: "border-transparent bg-surface-theme-light-fail-accent-1 text-text-theme-light-fail-on-base",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
