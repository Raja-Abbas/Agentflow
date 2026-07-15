"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Bot,
  GitBranch,
  MessageSquare,
  BarChart3,
  Settings,
  X,
  Hexagon,
  ChevronLeft,
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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md lg:hidden"
      >
        <LayoutDashboard className="h-5 w-5 text-slate-700" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300
          ${collapsed ? "w-[72px]" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <Link href="/dashboard" className="flex-shrink-0">
            {!collapsed && <Logo />}
            {collapsed && (
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
            )}
          </Link>
          <button
            onClick={() => {
              if (mobileOpen) setMobileOpen(false);
              else setCollapsed(!collapsed);
            }}
            className="hidden h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:flex"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : collapsed ? (
              <ChevronLeft className="h-4 w-4 rotate-180" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-indigo-600" : ""}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-slate-200 p-4">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              RA
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">Raja Abbas</p>
                <p className="truncate text-xs text-slate-500">raja@agentflow.dev</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
