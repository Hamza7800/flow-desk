import type { IssuesType } from "@/server-actions/issues";
import { useIssueViewStore } from "@/store/issue-view-store";
import BoardCard from "./board-card";
import ListCard from "./list-card";

const IssueView = ({
  issue,
  isPlaceholder,
}: {
  issue: NonNullable<IssuesType["data"]>[number];
  isPlaceholder?: boolean;
}) => {
  const { viewMode } = useIssueViewStore();
  switch (viewMode) {
    case "board":
      return <BoardCard issue={issue} />;

    case "list":
      return <ListCard issue={issue} isPlaceholder={isPlaceholder} />;
  }
};

export default IssueView;
