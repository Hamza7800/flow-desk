import type { Issues } from "@/lib/dnd-config/issue-groups";
import type { Projects } from "@/lib/dnd-config/project-groups";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

export const DroppableGroup = ({
  containerId,
  items,
  children,
  className,
  headerOnly = false,
}: {
  containerId: string;
  items: Issues | Projects;
  children: React.ReactNode;
  className?: string;
  headerOnly?: boolean;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: containerId });

  if (headerOnly) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "rounded-lg transition-colors duration-150",
          isOver && "bg-indigo-500/10 ring-1 ring-indigo-100/10 ring-inset",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        className,
        "min-h-2 transition-colors duration-150",
        isOver &&
          "rounded-lg bg-indigo-500/5 ring-1 ring-indigo-100/10 ring-inset",
      )}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {children}
        {items.length === 0 && (
          <div
            className={cn(
              "mx-1 my-1 h-0.5 rounded-full transition-all duration-150",
              isOver ? "bg-indigo-100/20" : "bg-transparent",
            )}
          />
        )}
      </SortableContext>
    </div>
  );
};

export const Draggable = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};
