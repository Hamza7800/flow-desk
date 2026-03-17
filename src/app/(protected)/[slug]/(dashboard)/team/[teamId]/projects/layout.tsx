import { type ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { DisplayControls } from "@/app/(protected)/[slug]/(dashboard)/_components/projects/project-display-controls";
import CreateProjectButton from "@/app/(protected)/[slug]/(dashboard)/_components/projects/create-project-button";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SiteHeader heading="Team Projects">
        <div className="flex items-center gap-2 pr-2">
          <CreateProjectButton text="New" />
          <DisplayControls />
        </div>
      </SiteHeader>
      <div className="flex min-h-0 flex-1">
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
