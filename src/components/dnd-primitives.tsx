import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

export const DroppableGroup = ({
  groupKey,
  children,
  className,
}: {
  groupKey: string;
  children: ReactNode;
  className?: string;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: groupKey });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        className,
        isOver && "bg-indigo-500/5 ring-2 ring-indigo-500/50 transition-colors",
      )}
    >
      {children}
    </div>
  );
};

export const DraggableIssue = ({
  issueId,
  children,
}: {
  issueId: string;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issueId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};
