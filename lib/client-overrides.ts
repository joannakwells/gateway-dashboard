"use client";

import type { ContentItem } from "@/lib/types";

const overrides = new Map<string, Partial<ContentItem>>();
const newItems: ContentItem[] = [];

export function setContentOverride(id: string, data: Partial<ContentItem>) {
  overrides.set(id, data);
}

export function addNewContentItem(item: ContentItem) {
  if (!newItems.find((i) => i.id === item.id)) {
    newItems.unshift(item);
  }
}

export function applyContentOverrides(items: ContentItem[]): ContentItem[] {
  const merged = [
    ...newItems.filter((n) => !items.find((i) => i.id === n.id)),
    ...items.map((item) => {
      const override = overrides.get(item.id);
      return override ? { ...item, ...override } : item;
    })
  ];
  return merged;
}
