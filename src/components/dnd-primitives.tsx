import type { Issues } from "@/lib/issue-config/issue-groups";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const DroppableGroup = ({
  containerId,
  items,
  children,
  className,
}: {
  containerId: string;
  items: Issues;
  children: React.ReactNode;
  className?: string;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: containerId });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        className,
        "min-h-10 transition-colors duration-150",
        isOver &&
          "rounded-lg bg-indigo-500/5 ring-1 ring-indigo-500/20 ring-inset",
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
              "h-16 rounded border border-dashed border-zinc-700/50",
              "flex items-center justify-center text-xs text-zinc-600",
              isOver && "border-indigo-500/40 text-indigo-400/60",
            )}
          >
            Drop here
          </div>
        )}
      </SortableContext>
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

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};
