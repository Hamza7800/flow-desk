import type { IssuesType } from "@/server-actions/issues";

export type StatusKey =
  | "backlog"
  | "planned"
  | "in-progress"
  | "completed"
  | "canceled";
export type PriorityKey = "no-priority" | "urgent" | "high" | "medium" | "low";
export type GroupKey = StatusKey | PriorityKey;

export type GroupConfig = {
  key: GroupKey;
  label: string;
  icon: string;
  color: string;
};

export const STATUS_GROUPS: GroupConfig[] = [
  { key: "backlog", label: "Backlog", icon: "···", color: "text-zinc-400" },
  { key: "planned", label: "Planned", icon: "○", color: "text-blue-400" },
  {
    key: "in-progress",
    label: "In Progress",
    icon: "◑",
    color: "text-yellow-400",
  },
  { key: "completed", label: "Completed", icon: "●", color: "text-green-400" },
  { key: "canceled", label: "Canceled", icon: "✕", color: "text-zinc-500" },
];

export const PRIORITY_GROUPS: GroupConfig[] = [
  {
    key: "no-priority",
    label: "No Priority",
    icon: "—",
    color: "text-zinc-400",
  },
  { key: "urgent", label: "Urgent", icon: "!", color: "text-red-400" },
  { key: "high", label: "High", icon: "↑", color: "text-orange-400" },
  { key: "medium", label: "Medium", icon: "→", color: "text-yellow-400" },
  { key: "low", label: "Low", icon: "↓", color: "text-blue-400" },
];

export const GROUP_CONFIG: Record<"status" | "priority", GroupConfig[]> = {
  status: STATUS_GROUPS,
  priority: PRIORITY_GROUPS,
};

export type Issues = NonNullable<IssuesType["data"]>;
