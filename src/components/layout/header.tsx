"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/agents": "Agents",
  "/flows": "Flows",
  "/conversations": "Conversations",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();

  const title =
    pageTitles[pathname ?? ""] ??
    (pathname?.startsWith("/agents")
      ? "Agents"
      : pathname?.startsWith("/flows")
        ? "Flows"
        : "Dashboard");

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6">
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <Menu className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <kbd className="hidden rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500 sm:inline-block">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600" />
        </button>

        {/* Avatar */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-sm font-semibold text-indigo-700 dark:text-indigo-400 transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-900/60">
          RA
        </button>
      </div>
    </header>
  );
}
