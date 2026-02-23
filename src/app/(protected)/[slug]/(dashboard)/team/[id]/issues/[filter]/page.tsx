"use client";

import { useState } from "react";
import { CreateIssueModal } from "@/app/(protected)/[slug]/(dashboard)/_components/create-issue";
import { useOrgTeams } from "@/hooks/use-teams";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { useParams } from "next/navigation";
import { useTeamIssues } from "@/hooks/use-issues";
import React from "react";
import { Card, Chip, Spinner, Tooltip } from "@heroui/react";
import { format } from "date-fns";

import {
  CircleDashed,
  Circle,
  Clock,
  CheckCircle2,
  XCircle,
  SignalLow,
  SignalMedium,
  SignalHigh,
  AlertCircle,
  Minus,
} from "lucide-react";

export const STATUS_CONFIG = {
  backlog: { label: "Backlog", icon: CircleDashed, color: "text-zinc-500" },
  planned: { label: "Planned", icon: Circle, color: "text-blue-500" },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    color: "text-orange-500",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-purple-500",
  },
  canceled: { label: "Canceled", icon: XCircle, color: "text-zinc-500" },
};

export const PRIORITY_CONFIG = {
  "no-priority": { label: "No Priority", icon: Minus, color: "text-zinc-500" },
  low: { label: "Low", icon: SignalLow, color: "text-zinc-400" },
  medium: { label: "Medium", icon: SignalMedium, color: "text-blue-400" },
  high: { label: "High", icon: SignalHigh, color: "text-orange-400" },
  urgent: { label: "Urgent", icon: AlertCircle, color: "text-red-500" },
};

// function IssueList({ issues }: { issues: any[] }) {
//   const groupedIssues = issues?.reduce(
//     (acc, issue) => {
//       const status = issue.status || "backlog";
//       if (!acc[status]) acc[status] = [];
//       acc[status].push(issue);
//       return acc;
//     },
//     {} as Record<string, any[]>,
//   );

//   return (
//     <div className="flex h-full w-full gap-6 overflow-x-auto p-6">
//       {Object.entries(STATUS_CONFIG).map(([status, config]) => {
//         const items = groupedIssues?.[status] || [];

//         return (
//           <div
//             key={status}
//             className="flex w-80 shrink-0 flex-col rounded-xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-sm"
//           >
//             {/* Column Header */}
//             <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
//               <div className="flex items-center gap-2">
//                 <config.icon size={16} className={config.color} />
//                 <span className="text-sm font-semibold text-zinc-300">
//                   {config.label}
//                 </span>
//               </div>

//               <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
//                 {items.length}
//               </span>
//             </div>

//             {/* Issues */}
//             <div className="flex flex-col gap-3 p-3">
//               {items.length === 0 ? (
//                 <div className="rounded-md border border-dashed border-zinc-800 p-4 text-center text-xs text-zinc-600">
//                   No issues
//                 </div>
//               ) : (
//                 items.map((issue) => <IssueCard key={issue.id} issue={issue} />)
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
// function IssueCard({ issue }: { issue: any }) {
//   const priority =
//     PRIORITY_CONFIG[issue.priority as keyof typeof PRIORITY_CONFIG];

//   const PriorityIcon = priority?.icon;

//   return (
//     <div className="group cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-md">
//       {/* Top Row */}
//       <div className="mb-2 flex items-center justify-between">
//         <span className="font-mono text-xs text-zinc-500">
//           {issue.identifier}
//         </span>

//         {issue.dueDate && (
//           <span className="text-xs text-zinc-500">
//             {format(new Date(issue.dueDate), "MMM d")}
//           </span>
//         )}
//       </div>

//       {/* Title */}
//       <h4 className="mb-3 text-sm font-medium text-zinc-200 group-hover:text-white">
//         {issue.title}
//       </h4>

//       {/* Bottom Row */}
//       <div className="flex items-center justify-between">
//         {/* Priority */}
//         {priority && (
//           <div className={`flex items-center gap-1 text-xs ${priority.color}`}>
//             <PriorityIcon size={14} />
//             <span>{priority.label}</span>
//           </div>
//         )}

//         {/* Project Tag */}
//         {issue.projectId && (
//           <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
//             Project
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }

function IssueList({ issues }: { issues: any[] }) {
  const grouped = issues?.reduce(
    (acc, issue) => {
      const status = issue.status || "backlog";
      if (!acc[status]) acc[status] = [];
      acc[status].push(issue);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  return (
    <div className="w-full">
      {Object.entries(grouped).map(([status, items]) => {
        const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

        return (
          <div key={status} className="mb-6">
            {/* Group Header */}
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-gradient-to-r from-zinc-950 to-zinc-900 px-6 py-3">
              <config.icon size={16} className={config.color} />
              <span className="text-sm font-semibold text-zinc-300">
                {config.label}
              </span>
              <span className="text-sm text-zinc-500">{items?.length}</span>
            </div>

            {/* Rows */}
            <div>
              {items?.map((issue: any) => (
                <IssueRow key={issue.id} issue={issue} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IssueRow({ issue }: { issue: any }) {
  const priority =
    PRIORITY_CONFIG[issue.priority as keyof typeof PRIORITY_CONFIG];

  const PriorityIcon = priority?.icon;

  return (
    <div className="group flex w-full items-center justify-between border-b border-zinc-900 px-6 py-3 transition-colors hover:bg-zinc-900/40">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* Checkbox Placeholder */}
        <div className="h-4 w-4 rounded-full border border-zinc-600" />

        {/* Identifier */}
        <span className="font-mono text-xs text-zinc-500">
          {issue.identifier}
        </span>

        {/* Title */}
        <span className="text-sm text-zinc-200 group-hover:text-white">
          {issue.title}
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* Priority */}
        {priority && (
          <div className={`flex items-center gap-1 text-xs ${priority.color}`}>
            <PriorityIcon size={14} />
          </div>
        )}

        {/* Project Badge */}
        {issue.projectId && (
          <span className="rounded-md border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
            Project
          </span>
        )}

        {/* Due Date */}
        {issue.dueDate && (
          <span className="text-xs text-zinc-500">
            {format(new Date(issue.dueDate), "MMM d")}
          </span>
        )}

        {/* Avatar Placeholder */}
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-600 text-xs font-medium text-black">
          HP
        </div>
      </div>
    </div>
  );
}

// TODO: FIX UI AND QUERY FUNCTIONS
export default function Page() {
  const { id } = useParams();
  const { org } = useOrganizationContext();
  const { data } = useOrgTeams(org?.id ?? "");

  const team = data?.data?.find((t) => t.id === id);

  const {
    data: issues,
    isPending,
    isError,
    error,
  } = useTeamIssues(org?.id ?? "", team?.id ?? "");

  if (!team) {
    return <h2>No team</h2>;
  }

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <IssueList issues={issues?.length ? issues : []} />
      <CreateIssueModal orgId={team.organizationId} teamId={team.id} />
    </>
  );
}
