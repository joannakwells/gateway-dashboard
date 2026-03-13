import { format, isPast, isToday, parseISO } from "date-fns";
import clsx from "clsx";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function formatDate(value: string) {
  return format(parseISO(value), "MMM d");
}

export function dueTone(value: string) {
  const date = parseISO(value);
  if (isToday(date)) {
    return "text-amber-700";
  }
  if (isPast(date)) {
    return "text-rose-700";
  }
  return "text-stone-600";
}

export function statusTone(value: string) {
  const map: Record<string, string> = {
    Approved: "bg-emerald-100 text-emerald-700",
    Published: "bg-emerald-100 text-emerald-700",
    Scheduled: "bg-sky-100 text-sky-700",
    Email: "bg-emerald-100 text-emerald-700",
    Instagram: "bg-fuchsia-100 text-fuchsia-700",
    Facebook: "bg-blue-100 text-blue-700",
    Website: "bg-sky-100 text-sky-700",
    "In-store": "bg-amber-100 text-amber-700",
    Print: "bg-orange-100 text-orange-700",
    "In review": "bg-amber-100 text-amber-700",
    "Ready for review": "bg-amber-100 text-amber-700",
    "In design": "bg-violet-100 text-violet-700",
    Drafting: "bg-stone-200 text-stone-700",
    Idea: "bg-stone-200 text-stone-700",
    "Revision requested": "bg-rose-100 text-rose-700",
    Urgent: "bg-rose-100 text-rose-700",
    High: "bg-orange-100 text-orange-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-stone-200 text-stone-700",
    Done: "bg-emerald-100 text-emerald-700",
    "In progress": "bg-sky-100 text-sky-700",
    Blocked: "bg-rose-100 text-rose-700"
  };

  return map[value] ?? "bg-stone-100 text-stone-700";
}
