import { IssueDndContext } from "@/components/context/issue-dnd-context";
import type { IssuesType } from "@/server-actions/issues";
import { useIssueViewStore } from "@/store/issue-view-store";
import { BoardView } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/board-view";
import IssueView from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-view";
import { ListView } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/list-view";

type Props = {
  issues: NonNullable<IssuesType["data"]>;
};

export const IssueBoard = ({ issues }: Props) => {
  const { viewMode } = useIssueViewStore();

  return (
    <div className="flex h-full flex-1 flex-col select-none">
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
