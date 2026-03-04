"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@heroui/react";
import { SidebarIcon } from "lucide-react";
import IssueProperties from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-properties";

export default function DetailsLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SiteHeader heading="Issue Details">
        <Button
          size="sm"
          className={"mr-1"}
          variant="ghost"
          onClick={() => setOpen(!open)}
        >
          <SidebarIcon />
        </Button>
      </SiteHeader>
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
          {open && <IssueProperties />}
        </div>
      </div>
    </div>
  );
}
