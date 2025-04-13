"use client";

import { UserNav } from "@/components/UserNav";
import { TeamSwitcher } from "@/components/TeamSwitcher";
import { MainNav } from "@/components/MainNav";

export function DashboardNav({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <TeamSwitcher />
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
    </div>
  );
} 