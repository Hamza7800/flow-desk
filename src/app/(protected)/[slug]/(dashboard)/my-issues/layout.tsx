import { Chip, Separator } from "@heroui/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { DisplayControls } from "../_components/issues/issues-display-controls";
import { SiteHeader } from "@/components/site-header";

const MyIssuesLayout = async ({
  params,
  children,
}: {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}) => {
  const { slug } = await params;
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SiteHeader heading="My Issues"></SiteHeader>
      <div className="shrink-0 gap-2">
        <div className="flex items-center justify-between p-1">
          <div className="flex">
            <Link href={`/${slug}/my-issues/assigned`}>
              <Chip className="mr-2">Assigned</Chip>
            </Link>
            <Link href={`/${slug}/my-issues/created`}>
              <Chip>Created</Chip>
            </Link>
          </div>
          <DisplayControls />
        </div>
        <Separator />
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MyIssuesLayout;
