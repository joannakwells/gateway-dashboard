import { addDays, endOfWeek, isWithinInterval, parseISO, startOfWeek } from "date-fns";
import { db } from "@/lib/store";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";
import type {
  Approval,
  CalendarEvent,
  Campaign,
  Comment,
  ContentItem,
  DashboardData,
  Task,
  WikiPage
} from "@/lib/types";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function todayIso() {
  return "2026-03-12";
}

export async function getUsers() {
  if (!isSupabaseConfigured) {
    return clone(db.users);
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase!.from("users").select("*").order("name");
  return (data ?? []) as typeof db.users;
}

export async function getCampaigns() {
  if (!isSupabaseConfigured) {
    return clone(db.campaigns);
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase!.from("campaigns").select("*").order("start_date");
  return (data ?? []).map((item: any) => ({
    id: item.id,
    name: item.name,
    theme: item.theme,
    startDate: item.start_date,
    endDate: item.end_date,
    ownerId: item.owner_id
  }));
}

export async function saveCampaign(input: Partial<Campaign> & { id?: string }) {
  const record: Campaign = {
    id: input.id ?? `c${Date.now()}`,
    name: input.name ?? "Untitled campaign",
    theme: input.theme ?? "",
    startDate: input.startDate ?? todayIso(),
    endDate: input.endDate ?? todayIso(),
    ownerId: input.ownerId ?? db.users[0].id
  };

  if (!isSupabaseConfigured) {
    const index = db.campaigns.findIndex((item) => item.id === record.id);
    if (index === -1) {
      db.campaigns.unshift(record);
    } else {
      db.campaigns[index] = record;
    }
    return clone(record);
  }

  const supabase = getSupabaseServerClient();
  await supabase!.from("campaigns").upsert({
    id: record.id,
    name: record.name,
    theme: record.theme,
    start_date: record.startDate,
    end_date: record.endDate,
    owner_id: record.ownerId
  });
  return record;
}

export async function getContentItems() {
  if (!isSupabaseConfigured) {
    return clone(db.contentItems);
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase!.from("content_items").select("*").order("due_date");
  return (data ?? []).map(mapContent);
}

export async function getContentItem(id: string) {
  const items = await getContentItems();
  return items.find((item) => item.id === id) ?? null;
}

export async function saveContentItem(input: Partial<ContentItem> & { id?: string }) {
  const record: ContentItem = {
    id: input.id ?? `ci${Date.now()}`,
    title: input.title ?? "Untitled content item",
    status: input.status ?? "Idea",
    contentType: input.contentType ?? "Email",
    campaignId: input.campaignId,
    ownerId: input.ownerId ?? db.users[1].id,
    ownerName: input.ownerName,
    dueDate: input.dueDate ?? todayIso(),
    priority: input.priority ?? "Medium",
    channel: input.channel ?? "Email",
    brief: input.brief ?? "",
    copy: input.copy ?? "",
    pricingDetails: input.pricingDetails ?? "",
    notes: input.notes ?? "",
    attachmentPlaceholder: input.attachmentPlaceholder ?? "",
    approvalStatus: input.approvalStatus ?? "Needs brief",
    archived: input.archived ?? false,
    scheduledDate: input.scheduledDate,
    updatedAt: todayIso()
  };

  if (!isSupabaseConfigured) {
    const index = db.contentItems.findIndex((item) => item.id === record.id);
    if (index === -1) {
      db.contentItems.unshift(record);
    } else {
      db.contentItems[index] = record;
    }
    return clone(record);
  }

  const supabase = getSupabaseServerClient();
  await supabase!.from("content_items").upsert({
    id: record.id,
    title: record.title,
    status: record.status,
    content_type: record.contentType,
    campaign_id: record.campaignId,
    owner_id: record.ownerId,
    due_date: record.dueDate,
    priority: record.priority,
    channel: record.channel,
    brief: record.brief,
    copy: record.copy,
    pricing_details: record.pricingDetails,
    notes: record.notes,
    attachment_placeholder: record.attachmentPlaceholder,
    approval_status: record.approvalStatus,
    archived: record.archived,
    scheduled_date: record.scheduledDate,
    updated_at: new Date().toISOString()
  });
  return record;
}

export async function deleteContentItem(id: string) {
  if (!isSupabaseConfigured) {
    const index = db.contentItems.findIndex((item) => item.id === id);
    if (index >= 0) {
      db.contentItems.splice(index, 1);
    }
    return;
  }

  const supabase = getSupabaseServerClient();
  await supabase!.from("content_items").delete().eq("id", id);
}

export async function getTasks() {
  if (!isSupabaseConfigured) {
    return clone(db.tasks);
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase!.from("tasks").select("*").order("due_date");
  return (data ?? []).map((item: any) => ({
    id: item.id,
    title: item.title,
    contentItemId: item.content_item_id,
    assignedUserId: item.assigned_user_id,
    dueDate: item.due_date,
    status: item.status,
    notes: item.notes
  })) as Task[];
}

export async function saveTask(input: Partial<Task> & { id?: string }) {
  const record: Task = {
    id: input.id ?? `t${Date.now()}`,
    title: input.title ?? "Untitled task",
    contentItemId: input.contentItemId,
    assignedUserId: input.assignedUserId ?? db.users[1].id,
    dueDate: input.dueDate ?? todayIso(),
    status: input.status ?? "To do",
    notes: input.notes ?? ""
  };

  if (!isSupabaseConfigured) {
    const index = db.tasks.findIndex((item) => item.id === record.id);
    if (index === -1) {
      db.tasks.unshift(record);
    } else {
      db.tasks[index] = record;
    }
    return clone(record);
  }

  const supabase = getSupabaseServerClient();
  await supabase!.from("tasks").upsert({
    id: record.id,
    title: record.title,
    content_item_id: record.contentItemId,
    assigned_user_id: record.assignedUserId,
    due_date: record.dueDate,
    status: record.status,
    notes: record.notes
  });
  return record;
}

export async function deleteTask(id: string) {
  if (!isSupabaseConfigured) {
    const index = db.tasks.findIndex((item) => item.id === id);
    if (index >= 0) {
      db.tasks.splice(index, 1);
    }
    return;
  }

  const supabase = getSupabaseServerClient();
  await supabase!.from("tasks").delete().eq("id", id);
}

export async function getCalendarEvents() {
  if (!isSupabaseConfigured) {
    return clone(db.calendarEvents);
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase!.from("calendar_events").select("*").order("date");
  return (data ?? []).map((item: any) => ({
    id: item.id,
    title: item.title,
    date: item.date,
    ownerId: item.owner_id,
    channel: item.channel,
    status: item.status,
    contentItemId: item.content_item_id,
    campaignId: item.campaign_id
  })) as CalendarEvent[];
}

export async function saveCalendarEvent(input: Partial<CalendarEvent> & { id?: string }) {
  const record: CalendarEvent = {
    id: input.id ?? `e${Date.now()}`,
    title: input.title ?? "Untitled calendar item",
    date: input.date ?? todayIso(),
    ownerId: input.ownerId ?? db.users[1].id,
    channel: input.channel ?? "Website",
    status: input.status ?? "Planned",
    contentItemId: input.contentItemId,
    campaignId: input.campaignId
  };

  if (!isSupabaseConfigured) {
    const index = db.calendarEvents.findIndex((item) => item.id === record.id);
    if (index === -1) {
      db.calendarEvents.unshift(record);
    } else {
      db.calendarEvents[index] = record;
    }
    return clone(record);
  }

  const supabase = getSupabaseServerClient();
  await supabase!.from("calendar_events").upsert({
    id: record.id,
    title: record.title,
    date: record.date,
    owner_id: record.ownerId,
    channel: record.channel,
    status: record.status,
    content_item_id: record.contentItemId,
    campaign_id: record.campaignId
  });
  return record;
}

export async function getApprovals() {
  if (!isSupabaseConfigured) {
    return clone(db.approvals);
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase!.from("approvals").select("*").order("updated_at", { ascending: false });
  return (data ?? []).map((item: any) => ({
    id: item.id,
    contentItemId: item.content_item_id,
    designStatus: item.design_status,
    reviewerId: item.reviewer_id,
    requestedEdits: item.requested_edits,
    approvalToggle: item.approval_toggle,
    versionLabel: item.version_label,
    updatedAt: item.updated_at
  })) as Approval[];
}

export async function saveApproval(input: Partial<Approval> & { id?: string }) {
  const record: Approval = {
    id: input.id ?? `a${Date.now()}`,
    contentItemId: input.contentItemId ?? db.contentItems[0].id,
    designStatus: input.designStatus ?? "Needs brief",
    reviewerId: input.reviewerId ?? db.users[0].id,
    requestedEdits: input.requestedEdits ?? "",
    approvalToggle: input.approvalToggle ?? false,
    versionLabel: input.versionLabel ?? "v1",
    updatedAt: new Date().toISOString()
  };

  if (!isSupabaseConfigured) {
    const index = db.approvals.findIndex((item) => item.id === record.id);
    if (index === -1) {
      db.approvals.unshift(record);
    } else {
      db.approvals[index] = record;
    }
    return clone(record);
  }

  const supabase = getSupabaseServerClient();
  await supabase!.from("approvals").upsert({
    id: record.id,
    content_item_id: record.contentItemId,
    design_status: record.designStatus,
    reviewer_id: record.reviewerId,
    requested_edits: record.requestedEdits,
    approval_toggle: record.approvalToggle,
    version_label: record.versionLabel,
    updated_at: record.updatedAt
  });
  return record;
}

export async function getComments() {
  if (!isSupabaseConfigured) {
    return clone(db.comments);
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase!.from("comments").select("*").order("created_at");
  return (data ?? []).map((item: any) => ({
    id: item.id,
    contentItemId: item.content_item_id,
    approvalId: item.approval_id,
    authorId: item.author_id,
    body: item.body,
    createdAt: item.created_at
  })) as Comment[];
}

export async function getWikiPages() {
  if (!isSupabaseConfigured) {
    return clone(db.wikiPages);
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase!.from("wiki_pages").select("*").order("updated_at", { ascending: false });
  return (data ?? []).map((item: any) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    parentId: item.parent_id,
    summary: item.summary,
    body: item.body,
    updatedAt: item.updated_at
  })) as WikiPage[];
}

export async function getWikiPage(id: string) {
  const pages = await getWikiPages();
  return pages.find((item) => item.id === id) ?? null;
}

export async function saveWikiPage(input: Partial<WikiPage> & { id?: string }) {
  const record: WikiPage = {
    id: input.id ?? `w${Date.now()}`,
    title: input.title ?? "Untitled page",
    slug: input.slug ?? `page-${Date.now()}`,
    parentId: input.parentId,
    summary: input.summary ?? "",
    body: input.body ?? "",
    updatedAt: todayIso()
  };

  if (!isSupabaseConfigured) {
    const index = db.wikiPages.findIndex((item) => item.id === record.id);
    if (index === -1) {
      db.wikiPages.unshift(record);
    } else {
      db.wikiPages[index] = record;
    }
    return clone(record);
  }

  const supabase = getSupabaseServerClient();
  await supabase!.from("wiki_pages").upsert({
    id: record.id,
    title: record.title,
    slug: record.slug,
    parent_id: record.parentId,
    summary: record.summary,
    body: record.body,
    updated_at: record.updatedAt
  });
  return record;
}

export async function getDashboardData(): Promise<DashboardData> {
  const [items, allTasks, allApprovals, events] = await Promise.all([
    getContentItems(),
    getTasks(),
    getApprovals(),
    getCalendarEvents()
  ]);

  const week = {
    start: startOfWeek(parseISO(todayIso())),
    end: endOfWeek(parseISO(todayIso()))
  };

  return {
    upcomingDeadlines: items.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4),
    weeklyTasks: allTasks.filter((task) => isWithinInterval(parseISO(task.dueDate), week)),
    pendingApprovals: allApprovals.filter((approval) => !approval.approvalToggle),
    recentItems: items.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4),
    calendarPreview: events.filter((event) =>
      isWithinInterval(parseISO(event.date), { start: parseISO(todayIso()), end: addDays(parseISO(todayIso()), 10) })
    )
  };
}

function mapContent(item: any): ContentItem {
  return {
    id: item.id,
    title: item.title,
    status: item.status,
    contentType: item.content_type,
    campaignId: item.campaign_id,
    ownerId: item.owner_id,
    dueDate: item.due_date,
    priority: item.priority,
    channel: item.channel,
    brief: item.brief,
    copy: item.copy,
    pricingDetails: item.pricing_details,
    notes: item.notes,
    attachmentPlaceholder: item.attachment_placeholder,
    approvalStatus: item.approval_status,
    archived: item.archived,
    scheduledDate: item.scheduled_date,
    updatedAt: item.updated_at
  };
}
