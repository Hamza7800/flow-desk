export const STATUS_OPTIONS = [
  { key: "backlog", label: "Backlog" },
  { key: "planned", label: "Planned" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "canceled", label: "Canceled" },
];

export const PRIORITY_OPTIONS = [
  { key: "no-priority", label: "No Priority" },
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
  { key: "urgent", label: "Urgent" },
];

export type Priority =
  | "no-priority"
  | "urgent"
  | "high"
  | "medium"
  | "low"
  | undefined;

export type Status =
  | "backlog"
  | "planned"
  | "in-progress"
  | "completed"
  | "canceled"
  | undefined;
