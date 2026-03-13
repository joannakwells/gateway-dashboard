export type UserRole = "owner" | "marketing_manager" | "designer" | "staff";

export type ContentStatus =
  | "Idea"
  | "Drafting"
  | "Awaiting internal info"
  | "Ready for design"
  | "In design"
  | "In review"
  | "Approved"
  | "Scheduled"
  | "Published"
  | "Archived";

export type ContentType =
  | "Email"
  | "Social post"
  | "Website update"
  | "Signage"
  | "Event promotion"
  | "Print piece"
  | "Ad"
  | "Announcement";

export type ApprovalStatus =
  | "Needs brief"
  | "In progress"
  | "Ready for review"
  | "Revision requested"
  | "Approved";

export type TaskStatus = "To do" | "In progress" | "Blocked" | "Done";

export type Priority = "Low" | "Medium" | "High" | "Urgent";

export type Channel = "Email" | "Instagram" | "Facebook" | "Website" | "In-store" | "Print";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Campaign {
  id: string;
  name: string;
  theme: string;
  startDate: string;
  endDate: string;
  ownerId: string;
}

export interface Comment {
  id: string;
  contentItemId?: string;
  approvalId?: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  status: ContentStatus;
  contentType: ContentType;
  campaignId?: string;
  ownerId: string;
  ownerName?: string;
  dueDate: string;
  priority: Priority;
  channel: Channel;
  brief: string;
  copy: string;
  pricingDetails: string;
  notes: string;
  attachmentPlaceholder: string;
  approvalStatus: ApprovalStatus;
  archived: boolean;
  scheduledDate?: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  contentItemId?: string;
  assignedUserId: string;
  dueDate: string;
  status: TaskStatus;
  notes: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  ownerId: string;
  channel: Channel;
  status: ContentStatus | "Planned";
  contentItemId?: string;
  campaignId?: string;
}

export interface Approval {
  id: string;
  contentItemId: string;
  designStatus: ApprovalStatus;
  reviewerId: string;
  requestedEdits: string;
  approvalToggle: boolean;
  versionLabel: string;
  updatedAt: string;
}

export interface WikiPage {
  id: string;
  title: string;
  slug: string;
  parentId?: string;
  summary: string;
  body: string;
  updatedAt: string;
}

export interface DashboardData {
  upcomingDeadlines: ContentItem[];
  weeklyTasks: Task[];
  pendingApprovals: Approval[];
  recentItems: ContentItem[];
  calendarPreview: CalendarEvent[];
}
