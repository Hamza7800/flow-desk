import type { Projects } from "@/lib/dnd-config/project-groups";
import { useProjectViewStore } from "@/store/project-view-store";
import { ProjectDndContext } from "@/components/context/project-dnd-context";
import { ListView } from "./list-view";
import ProjectView from "./project-view";
import { BoardView } from "./board-view";

type Props = {
  projects: Projects;
};

export const ProjectBoard = ({ projects }: Props) => {
  const { viewMode } = useProjectViewStore();

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col select-none">
      <ProjectDndContext
        projects={projects}
        renderCard={(project) => (
          <div className="pointer-events-none">
            <ProjectView project={project} isPlaceholder />
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
      </ProjectDndContext>
    </div>
  );
};
