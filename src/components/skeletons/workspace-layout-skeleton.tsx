import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import type { ComponentProps } from "react";
import { LoadingState } from "@/components/loading-state";

const WorkspaceLayoutSkeleton = () => {
  return (
    <SidebarProvider
      style={
        {
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SideBarPlaceHolder variant="inset" />
      <SidebarInset className="overflow-hidden border bg-[#101012]">
        <div className="@container/main flex h-full min-h-0 flex-1 flex-col">
          <LoadingState />
        </div>
      </SidebarInset>
    </SidebarProvider>
    // <div className="shadow-panel flex h-screen gap-2 overflow-hidden rounded-lg bg-transparent">
    //   <Skeleton className="h-full w-[265px] flex-shrink-0 rounded-lg" />
    //   <div className="flex flex-1 flex-col space-y-2 overflow-hidden">
    //     <Skeleton className="h-[10vh] flex-shrink-0 rounded-lg" />
    //     <Skeleton className="flex-1 rounded-lg" />
    //   </div>
    // </div>
  );
};

export default WorkspaceLayoutSkeleton;

const SideBarPlaceHolder = ({
  slug,
  ...props
}: ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar {...props}>
      <SidebarContent className="scrollbar-thin gap-0"></SidebarContent>
    </Sidebar>
  );
};
