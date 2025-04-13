"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function UserNav() {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Sign Out
      </Button>
    </div>
  );
} 