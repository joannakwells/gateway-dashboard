"use client";

import type { ContentItem } from "@/lib/types";

const overrides = new Map<string, Partial<ContentItem>>();

export function setContentOverride(id: string, data: Partial<ContentItem>) {
  overrides.set(id, data);
}

export function applyContentOverrides(items: ContentItem[]): ContentItem[] {
  return items.map((item) => {
    const override = overrides.get(item.id);
    return override ? { ...item, ...override } : item;
  });
}
