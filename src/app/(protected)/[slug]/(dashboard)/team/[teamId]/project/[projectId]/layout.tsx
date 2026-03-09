"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DetailsSidebarContent } from "@/app/(protected)/[slug]/(dashboard)/_components/details-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button, Chip, Separator } from "@heroui/react";
import { SidebarIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DisplayControls } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issues-display-controls";

export default function DetailsLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const { slug, projectId, teamId } = useParams<{
    slug: string;
    teamId: string;
    projectId: string;
  }>();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SiteHeader heading="Team Projects">
        <Button
          size="sm"
          className={"mr-1"}
          variant="ghost"
          onClick={() => setOpen(!open)}
        >
          <SidebarIcon />
        </Button>
      </SiteHeader>
      <div className="shrink-0 gap-2">
        <div className="flex items-center justify-between p-1">
          <div className="flex">
            <Link
              href={`/${slug}/team/${teamId}/project/${projectId}/overview`}
            >
              <Chip className="mr-2">Overview</Chip>
            </Link>
            <Link href={`/${slug}/team/${teamId}/project/${projectId}/issues`}>
              <Chip>Issues</Chip>
            </Link>
          </div>
          <DisplayControls />
        </div>
        <Separator />
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>

        <div
          className={cn(
            "h-full border-l bg-[#101012] p-2 transition-all duration-300",
            open ? "w-80" : "w-0 p-0",
          )}
        >
          {open && <DetailsSidebarContent />}
        </div>
      </div>
    </div>
  );
}
