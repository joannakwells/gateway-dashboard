import { approvals, calendarEvents, campaigns, comments, contentItems, tasks, users, wikiPages } from "@/lib/seed";
import type { Approval, CalendarEvent, Campaign, Comment, ContentItem, Task, User, WikiPage } from "@/lib/types";

export const db = {
  users,
  campaigns,
  contentItems,
  tasks,
  calendarEvents,
  approvals,
  comments,
  wikiPages
};

export type TableName = keyof typeof db;
export type TableRecord =
  | User
  | Campaign
  | ContentItem
  | Task
  | CalendarEvent
  | Approval
  | Comment
  | WikiPage;
