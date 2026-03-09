"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  defaultDropAnimationSideEffects,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type DragCancelEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { useProjectViewStore, type GroupBy } from "@/store/project-view-store";
import { GROUP_CONFIG, type Projects } from "@/lib/dnd-config/project-groups";
import { useOrganizationContext } from "./organization-client-context";
import { useUpdateProjects } from "@/hooks/use-projects";

export type ProjectContainer = {
  id: string;
  label: string;
  icon: string;
  color: string;
  items: Projects;
};

const buildContainers = (
  projects: Projects,
  groupBy: GroupBy,
): ProjectContainer[] =>
  GROUP_CONFIG[groupBy].map((config) => ({
    id: config.key,
    label: config.label,
    icon: config.icon,
    color: config.color,
    items: projects.filter((project) => project[groupBy] === config.key),
  }));

type Props = {
  projects: Projects;
  renderCard: (project: Projects[number]) => ReactNode;
  children: (containers: ProjectContainer[]) => ReactNode;
};

// TODO: MAKE DND REUSABLE
export const ProjectDndContext = ({
  projects,
  renderCard,
  children,
}: Props) => {
  const { groupBy } = useProjectViewStore();
  const { org } = useOrganizationContext();
  const [containers, setContainers] = useState<ProjectContainer[]>(() =>
    buildContainers(projects, groupBy),
  );
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const updateProject = useUpdateProjects(org?.id ?? "");

  const isDragging = activeId !== null;

  useEffect(() => {
    if (!isDragging && !pendingMutationRef.current) {
      setContainers(buildContainers(projects, groupBy));
    }
  }, [projects, groupBy]);

  const originalContainerRef = useRef<string | null>(null);
  const pendingMutationRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const containersRef = useRef(containers);
  useEffect(() => {
    containersRef.current = containers;
  }, [containers]);

  const findContainerId = (id: UniqueIdentifier): string | undefined => {
    const current = containersRef.current;
    if (current.some((c) => c.id === id)) return id as string;
    return current.find((c) => c.items.some((item) => item.id === id))?.id;
  };

  const getActiveProject = (): Projects[number] | null => {
    if (!activeId) return null;
    for (const container of containersRef.current) {
      const project = container.items.find((item) => item.id === activeId);
      if (project) return project;
    }
    return null;
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
    originalContainerRef.current = findContainerId(active.id) ?? null;
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeContainerId = findContainerId(active.id);
    const overContainerId = findContainerId(over.id);

    if (!activeContainerId || !overContainerId) return;

    if (activeContainerId === overContainerId) {
      if (active.id === over.id) return;

      setContainers((prev) =>
        prev.map((container) => {
          if (container.id !== activeContainerId) return container;

          const oldIndex = container.items.findIndex((i) => i.id === active.id);
          const newIndex = container.items.findIndex((i) => i.id === over.id);

          if (oldIndex === -1 || newIndex === -1) return container;

          return {
            ...container,
            items: arrayMove(container.items, oldIndex, newIndex),
          };
        }),
      );

      return;
    }

    setContainers((prev) => {
      const activeContainer = prev.find((c) => c.id === activeContainerId);
      if (!activeContainer) return prev;

      const activeItem = activeContainer.items.find((i) => i.id === active.id);
      if (!activeItem) return prev;

      const updatedItem = { ...activeItem, [groupBy]: overContainerId };

      return prev.map((container) => {
        if (container.id === activeContainerId) {
          return {
            ...container,
            items: container.items.filter((i) => i.id !== active.id),
          };
        }

        if (container.id === overContainerId) {
          if (over.id === overContainerId) {
            return { ...container, items: [...container.items, updatedItem] };
          }

          const overItemIndex = container.items.findIndex(
            (i) => i.id === over.id,
          );

          if (overItemIndex !== -1) {
            return {
              ...container,
              items: [
                ...container.items.slice(0, overItemIndex + 1),
                updatedItem,
                ...container.items.slice(overItemIndex + 1),
              ],
            };
          }

          return { ...container, items: [...container.items, updatedItem] };
        }

        return container;
      });
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);

    const originalContainerId = originalContainerRef.current;
    originalContainerRef.current = null;

    if (!over) {
      pendingMutationRef.current = false;
      setContainers(buildContainers(projects, groupBy));
      return;
    }

    const overContainerId = findContainerId(over.id);

    if (!originalContainerId || !overContainerId) return;

    if (originalContainerId === overContainerId) return;

    const originalProject = projects.find((p) => p.id === active.id);
    if (!originalProject) return;

    pendingMutationRef.current = true;

    console.log(
      {
        issueId: active.id as string,
        values: { [groupBy]: overContainerId },
        teamId: originalProject.teamId ?? "",
      },
      {
        onSettled: () => {
          pendingMutationRef.current = false;
        },
      },
    );
    updateProject.mutate(
      {
        values: { [groupBy]: overContainerId },
        projectId: originalProject.id,
        teamId: originalProject.teamId ?? "",
      },
      {
        onSettled: () => {
          pendingMutationRef.current = false;
        },
      },
    );
  };

  const handleDragCancel = (_event: DragCancelEvent) => {
    setActiveId(null);
    originalContainerRef.current = null;
    pendingMutationRef.current = false;
    setContainers(buildContainers(projects, groupBy));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children(containers)}

      <DragOverlay
        dropAnimation={{
          duration: 150,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: "0.5" } },
          }),
        }}
      >
        {activeId ? (
          <div className="cursor-grabbing">
            {renderCard(getActiveProject()!)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
