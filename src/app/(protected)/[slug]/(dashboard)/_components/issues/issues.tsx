"use client";

import { CreateIssueModal } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/create-issue";
import { useTeamIssues, useUpdateIssue } from "@/hooks/use-issues";
import React from "react";
import { Card, Chip, Separator } from "@heroui/react";

import type { IssuesType } from "@/server-actions/issues";
import { useParams, useRouter } from "next/navigation";
import DeleteIssue from "./delete-issue";
import PrioritySelect from "./priority-select";
import StatusSelect from "./status-select";
import AssigneeSelect from "./assignee-select";
import InlineInput from "./input";
import { issueSchema, issueUpdateSchema } from "@/zod-schema/issue-schema";
import type { Priority, Status } from "@/lib/contants";

type Issue = {
  status:
    | "backlog"
    | "planned"
    | "in-progress"
    | "completed"
    | "canceled"
    | null;
  priority: "no-priority" | "urgent" | "high" | "medium" | "low" | null;
};

interface IssuesBoardProps {
  issues: IssuesType["data"] | null;
}

const statusColumns = [
  "backlog",
  "planned",
  "in-progress",
  "completed",
  "canceled",
] as const;

const priorityColor = (priority: Issue["priority"]) => {
  switch (priority) {
    case "urgent":
      return "danger";
    case "high":
      return "warning";
    case "medium":
      return "accent";
    case "low":
      return "success";
    default:
      return "default";
  }
};

const statusColor = (status: Issue["status"]) => {
  switch (status) {
    case "completed":
      return "success";
    case "in-progress":
      return "accent";
    case "planned":
      return "warning";
    case "backlog":
      return "default";
    case "canceled":
      return "danger";
    default:
      return "default";
  }
};

// export const IssuesBoard: React.FC<IssuesBoardProps> = ({ issues }) => {
//   const router = useRouter();
//   const { slug } = useParams<{ slug: string }>();
//   if (!issues || issues.length === 0) {
//     return (
//       <div className="text-muted-foreground flex items-center justify-center py-20">
//         No issues found.
//       </div>
//     );
//   }

//   return (
//     <div className="flex gap-6 overflow-x-auto pb-6">
//       {statusColumns.map((status) => {
//         const filtered = issues.filter((issue) => issue.status === status);

//         return (
//           <div key={status} className="min-w-[300px] flex-1 space-y-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold capitalize">
//                 {status.replace("-", " ")}
//               </h2>
//               <Chip size="sm" variant="secondary">
//                 {filtered.length}
//               </Chip>
//             </div>

//             <Separator />

//             {filtered.map((issue) => (
//               <Card
//                 onClick={() => router.push(`/${slug}/issue/${issue.id}`)}
//                 key={issue.id}
//                 className="transition-all hover:scale-[1.02]"
//               >
//                 <Card.Header className="flex flex-col items-start gap-2">
//                   <div className="flex w-full items-start justify-between">
//                     <div>
//                       <p className="text-muted-foreground text-sm">
//                         {issue.identifier ?? "No-ID"}
//                       </p>
//                       <h3 className="text-base font-semibold">{issue.title}</h3>
//                     </div>

//                     <Chip
//                       size="sm"
//                       color={priorityColor(issue.priority)}
//                       variant="secondary"
//                     >
//                       {issue.priority ?? "no-priority"}
//                     </Chip>
//                   </div>
//                 </Card.Header>

//                 <Card.Content className="space-y-3">
//                   {issue.description && (
//                     <p className="text-muted-foreground line-clamp-3 text-sm">
//                       {issue.description}
//                     </p>
//                   )}

//                   <div className="flex items-center justify-between">
//                     <Chip
//                       size="sm"
//                       color={statusColor(issue.status)}
//                       variant="soft"
//                     >
//                       {issue.status ?? "unknown"}
//                     </Chip>

//                     {issue.dueDate && (
//                       <span className="text-muted-foreground text-xs">
//                         Due {new Date(issue.dueDate).toLocaleDateString()}
//                       </span>
//                     )}
//                   </div>
//                 </Card.Content>
//               </Card>
//             ))}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

type IssueType = {
  issue: NonNullable<IssuesType["data"]>[number];
};

const Issue = ({ issue }: IssueType) => {
  const mutate = useUpdateIssue(issue.id, {
    orgId: issue.organizationId,
    projectId: issue.projectId,
    teamId: issue?.teamId,
  });

  return (
    <Card>
      <h2>
        <InlineInput
          schema={issueSchema.shape.title}
          initialValue={issue.title}
          onSave={(val) => mutate.mutate({ title: val })}
          debounceMs={1500}
          placeholder="Issue title"
        />
      </h2>
      <h2>
        <InlineInput
          schema={issueSchema.shape.description}
          initialValue={issue.description ?? ""}
          onSave={(val) => mutate.mutate({ description: val })}
          debounceMs={1500}
          placeholder="Issue description"
        />
      </h2>
      <p>{issue.identifier}</p>
      <p>{issue.priority}</p>
      <StatusSelect
        value={issue.status ?? ""}
        onChange={(value) => mutate.mutate({ status: value as Status })}
      />
      <PrioritySelect
        value={issue.priority ?? ""}
        onChange={(value) => mutate.mutate({ priority: value as Priority })}
      />
      <AssigneeSelect
        value={issue.assignees?.map((a) => a.userId) ?? []}
        onChange={(values) => mutate.mutate({ assigneeIds: values })}
      />
      <DeleteIssue issueId={issue.id} teamId={issue.teamId ?? ""} />
    </Card>
  );
};

const Issues = ({
  initialData,
  teamId,
}: {
  teamId: string;
  initialData: IssuesType["data"];
}) => {
  const { data: issues, isError, error } = useTeamIssues(teamId, initialData);

  if (isError) {
    return <h2>Error : {error.message}</h2>;
  }

  return (
    <div>
      {issues?.map((issue) => (
        <Issue issue={issue} key={issue.id} />
      ))}
      <CreateIssueModal teamId={teamId} />
    </div>
  );
};

export default Issues;
