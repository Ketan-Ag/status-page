"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  {
    href: "/dashboard",
    label: "Overview",
  },
  {
    href: "/dashboard/services",
    label: "Services",
  },
  {
    href: "/dashboard/incidents",
    label: "Incidents",
  },
  {
    href: "/dashboard/teams",
    label: "Teams",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 ml-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
} 