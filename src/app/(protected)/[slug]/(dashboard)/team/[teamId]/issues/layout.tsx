"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { Button, Chip, Separator } from "@heroui/react";
import { SidebarIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetailsLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const { slug, projectId, teamId } = useParams<{
    slug: string;
    teamId: string;
    projectId: string;
  }>();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SiteHeader heading="Team Issues">
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
      </div>
    </div>
  );
}
