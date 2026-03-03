"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DetailsSidebarContent } from "../../_components/details-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button, Chip, Separator } from "@heroui/react";
import { Sidebar } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetailsLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const { slug, id } = useParams<{ slug: string; id: string }>();

  return (
    <div className="h-full">
      <SiteHeader heading="Team Projects">
        <Button
          size="sm"
          className={"mr-1"}
          variant="ghost"
          onClick={() => setOpen(!open)}
        >
          <Sidebar />
        </Button>
      </SiteHeader>
      <div className="gap-2">
        <div className="flex items-center justify-between p-1">
          <div className="flex">
            <Link href={`/${slug}/project/${id}/overview`}>
              <Chip className="mr-2">Overview</Chip>
            </Link>
            <Link href={`/${slug}/project/${id}/issues`}>
              <Chip>Issues</Chip>
            </Link>
          </div>
          {/* <DisplayControls /> */}
        </div>
        <Separator />
      </div>

      <div className="flex h-full">
        <div className="flex-1 overflow-hidden">{children}</div>

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
