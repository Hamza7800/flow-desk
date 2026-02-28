import { Chip, Separator } from "@heroui/react";
import Link from "next/link";
import type { ReactNode } from "react";

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
      <div className="mb-2 flex flex-col gap-2">
        <div>
          <Link href={`/${slug}/my-issues/assigned`}>
            <Chip className="mr-2">Assigned</Chip>
          </Link>
          <Link href={`/${slug}/my-issues/created`}>
            <Chip>Created</Chip>
          </Link>
        </div>
        <Separator />
      </div>
      <section>{children}</section>
    </div>
  );
};

export default MyIssuesLayout;
