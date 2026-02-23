import { Skeleton } from "@heroui/react";

const WorkspaceLayoutSkeleton = () => {
  return (
    <div className="shadow-panel flex h-screen gap-2 overflow-hidden rounded-lg bg-transparent">
      <Skeleton className="h-full w-[265px] flex-shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col space-y-2 overflow-hidden">
        <Skeleton className="h-[10vh] flex-shrink-0 rounded-lg" />
        <Skeleton className="flex-1 rounded-lg" />
      </div>
    </div>
  );
};

export default WorkspaceLayoutSkeleton;
