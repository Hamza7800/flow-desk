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
    <div>
      <SiteHeader heading="My Issues" />
      <div className="mb-2 gap-2">
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
      <section>{children}</section>
    </div>
  );
};

export default MyIssuesLayout;
