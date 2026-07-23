"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Bot, GitBranch, MessageSquare, BarChart3, Settings, X, Hexagon, ChevronLeft, Moon, Sun, LogOut,
} from "lucide-react";
import { Logo } from "@/components/logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/flows", label: "Flows", icon: GitBranch },
  { href: "/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.charAt(0).toUpperCase() || "?";

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <button onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md lg:hidden">
        <LayoutDashboard className="h-5 w-5 text-slate-700" />
      </button>

      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-64"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4">
          <Link href="/dashboard" className="flex-shrink-0">
            {!collapsed && <Logo />}
            {collapsed && (
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
            )}
          </Link>
          <button onClick={() => { if (mobileOpen) setMobileOpen(false); else setCollapsed(!collapsed); }}
            className="hidden h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:flex">
            {mobileOpen ? <X className="h-4 w-4" /> : collapsed ? <ChevronLeft className="h-4 w-4 rotate-180" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 lg:hidden">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"} ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}>
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 dark:border-slate-800 px-3 py-2">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${collapsed ? "justify-center" : ""} ${mounted ? "text-slate-600 dark:text-slate-400" : "text-slate-400"}`}>
            {mounted && theme === "dark" ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
            {!collapsed && <span>{mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 p-4">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-sm font-semibold text-indigo-700 dark:text-indigo-400">
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{session?.user?.name || "User"}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{session?.user?.email || ""}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 transition-colors">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
