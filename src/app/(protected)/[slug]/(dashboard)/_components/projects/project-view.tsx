import type { Projects } from "@/lib/dnd-config/project-groups";

import BoardCard from "./board-card";
import ListCard from "./list-card";
import { useProjectViewStore } from "@/store/project-view-store";

const ProjectView = ({
  project,
  isPlaceholder,
}: {
  project: Projects[number];
  isPlaceholder?: boolean;
}) => {
  const { viewMode } = useProjectViewStore();
  switch (viewMode) {
    case "board":
      return <BoardCard project={project} />;

    case "list":
      return <ListCard project={project} isPlaceholder={isPlaceholder} />;
  }
};

export default ProjectView;
