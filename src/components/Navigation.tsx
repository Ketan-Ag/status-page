"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TeamSwitcher } from "./TeamSwitcher";

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/services", label: "Services" },
    { href: "/dashboard/incidents", label: "Incidents" },
    { href: "/dashboard/maintenances", label: "Maintenances" },
    { href: "/dashboard/teams", label: "Teams" },
  ];

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <TeamSwitcher />
        <div className="flex gap-6 md:gap-10 ml-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 