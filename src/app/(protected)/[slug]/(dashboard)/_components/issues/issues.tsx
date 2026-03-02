"use client";

import { CreateIssueModal } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/create-issue";
import { useTeamIssues } from "@/hooks/use-issues";

import type { IssuesType } from "@/server-actions/issues";
import { useIssueViewStore } from "@/store/issue-view-store";
import { DisplayControls } from "./display-controls";
import { ListView } from "./list-view";
import { BoardView } from "./board-view";
import { IssueDndContext } from "@/components/context/issue-dnd-context";
import IssueView from "./issue-view";

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

type Props = {
  issues: NonNullable<IssuesType["data"]>;
};

export const IssueBoard = ({ issues }: Props) => {
  const { viewMode } = useIssueViewStore();

  return (
    <div className="flex h-screen flex-col select-none">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-zinc-400">{issues.length} issues</p>
        <DisplayControls />
      </div>

      <IssueDndContext
        issues={issues}
        renderCard={(issue) => (
          <div className="pointer-events-none">
            <IssueView issue={issue} />
          </div>
        )}
      >
        {(containers) =>
          viewMode === "list" ? (
            <ListView containers={containers} />
          ) : (
            <BoardView containers={containers} />
          )
        }
      </IssueDndContext>
    </div>
  );
};

const Issues = ({
  initialData,
  teamId,
}: {
  teamId: string;
  initialData: IssuesType["data"];
}) => {
  // TODO remove useOrg hook
  const { data: issues, isError, error } = useTeamIssues(teamId, initialData);

  if (isError) {
    return <h2>Error : {error.message}</h2>;
  }

  return <IssueBoard issues={issues ?? []} />;
};

export default Issues;
