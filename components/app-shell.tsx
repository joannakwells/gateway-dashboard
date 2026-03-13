"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, CheckCheck, Home, LogIn, PanelsTopLeft, SquareCheckBig } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/content", label: "Content Hub", icon: PanelsTopLeft },
  { href: "/calendar", label: "Marketing Calendar", icon: CalendarDays },
  { href: "/approvals", label: "Approvals", icon: CheckCheck },
  { href: "/tasks", label: "Tasks", icon: SquareCheckBig },
  { href: "/wiki", label: "Internal Wiki", icon: BookOpen },
  { href: "/login", label: "Login", icon: LogIn }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 p-6">
      <aside className="panel sticky top-6 h-[calc(100vh-3rem)] w-72 shrink-0 p-5">
        <div className="rounded-2xl bg-soil px-4 py-5 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-white/70">Gateway Garden Center</p>
          <h1 className="mt-2 text-2xl font-semibold">Workspace</h1>
          <p className="mt-2 text-sm text-white/70">Marketing, approvals, operations, and internal knowledge in one place.</p>
        </div>
        <nav className="mt-6 space-y-1.5">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                  active ? "bg-moss text-white" : "text-stone-600 hover:bg-stone-100 hover:text-bark"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
          <p className="font-medium text-bark">Desktop-first by design</p>
          <p className="mt-1">Optimized for planning, approvals, and weekly operations. Tablet layouts remain usable.</p>
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
