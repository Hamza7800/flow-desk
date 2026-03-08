import {
  AlignLeft,
  AlertOctagon,
  BarChart2,
  TrendingUp,
  Minus,
} from "lucide-react";

export const STATUS_OPTIONS = [
  {
    key: "backlog",
    label: "Backlog",
    order: 1,
    icon: "⋯",
    color: "text-zinc-400",
    iconClass: "rounded-full border-2 border-dashed border-zinc-400",
  },
  {
    key: "planned",
    label: "Planned",
    order: 2,
    icon: "○",
    color: "text-zinc-300",
    iconClass: "rounded-full border-2 border-zinc-300",
  },
  {
    key: "in-progress",
    label: "In Progress",
    order: 3,
    icon: "◑",
    color: "text-yellow-400",
    iconClass: "rounded-full border-2 border-yellow-400",
  },
  {
    key: "completed",
    label: "Completed",
    order: 4,
    icon: "✓",
    color: "text-blue-500",
    iconClass: "rounded-full bg-blue-500 text-white",
  },
  {
    key: "canceled",
    label: "Canceled",
    order: 5,
    icon: "✕",
    color: "text-zinc-500",
    iconClass: "rounded-full bg-zinc-600 text-zinc-300",
  },
];

export const PRIORITY_OPTIONS = [
  {
    key: "no-priority",
    label: "No Priority",
    icon: Minus,
    color: "text-zinc-500",
    order: 0,
  },
  {
    key: "urgent",
    label: "Urgent",
    icon: AlertOctagon,
    color: "text-red-500",
    order: 1,
  },
  {
    key: "high",
    label: "High",
    icon: BarChart2,
    color: "text-orange-500",
    order: 2,
  },
  {
    key: "medium",
    label: "Medium",
    icon: TrendingUp,
    color: "text-yellow-500",
    order: 3,
  },
  {
    key: "low",
    label: "Low",
    icon: AlignLeft,
    color: "text-blue-500",
    order: 4,
  },
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
