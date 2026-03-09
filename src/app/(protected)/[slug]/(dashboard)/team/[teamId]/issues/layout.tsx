import { type ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { DisplayControls } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issues-display-controls";
import { Separator } from "@heroui/react";

export default function DetailsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SiteHeader heading="Team Issues"></SiteHeader>
      <div className="ml-auto p-1">
        <DisplayControls />
      </div>
      <Separator className="mb-2" />
      <div className="flex min-h-0 flex-1">
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
