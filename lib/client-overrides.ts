"use client";

import type { ContentItem } from "@/lib/types";

const OVERRIDES_KEY = "gw_content_overrides";
const NEW_ITEMS_KEY = "gw_new_content_items";

function readOverrides(): Record<string, Partial<ContentItem>> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) ?? "{}"); } catch { return {}; }
}

function writeOverrides(data: Record<string, Partial<ContentItem>>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(data));
}

function readNewItems(): ContentItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(NEW_ITEMS_KEY) ?? "[]"); } catch { return []; }
}

export function setContentOverride(id: string, data: Partial<ContentItem>) {
  const all = readOverrides();
  all[id] = data;
  writeOverrides(all);
}

export function getContentOverride(id: string): Partial<ContentItem> | undefined {
  return readOverrides()[id];
}

export function addNewContentItem(item: ContentItem) {
  if (typeof window === "undefined") return;
  const existing = readNewItems();
  if (!existing.find((i) => i.id === item.id)) {
    localStorage.setItem(NEW_ITEMS_KEY, JSON.stringify([item, ...existing]));
  }
}

export function applyContentOverrides(items: ContentItem[]): ContentItem[] {
  const overrides = readOverrides();
  const newItems = readNewItems();
  return [
    ...newItems.filter((n) => !items.find((i) => i.id === n.id)),
    ...items.map((item) => overrides[item.id] ? { ...item, ...overrides[item.id] } : item)
  ];
}
