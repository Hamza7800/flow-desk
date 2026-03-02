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

type Props = {
  issues: NonNullable<IssuesType["data"]>;
};

export const IssueBoard = ({ issues }: Props) => {
  const { viewMode } = useIssueViewStore();

  return (
    <div className="flex h-full max-w-4xl flex-col overflow-hidden select-none">
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
        {(containers) => (
          <div className="flex-1 overflow-hidden">
            {viewMode === "list" ? (
              <ListView containers={containers} />
            ) : (
              <BoardView containers={containers} />
            )}
          </div>
        )}
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

  return (
    <div className="h-screen overflow-hidden">
      <IssueBoard issues={issues ?? []} />
      {/* <CreateIssueModal teamId={teamId} /> */}
    </div>
  );
};

export default Issues;
