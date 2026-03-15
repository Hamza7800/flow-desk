import { LinkButton } from "@/components/link-button";

import { getOrganization } from "@/server-actions/organization";
import { Card } from "@heroui/react";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  redirect(`/${slug}/my-issues/assigned`);
}
