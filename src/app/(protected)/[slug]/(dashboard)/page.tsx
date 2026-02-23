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
  // try {
  const { slug } = await params;
  const result = await getOrganization(slug);

  if (!result.success) {
    throw Error(result.message);
  }

  if (!result.data) {
    throw new Error("Organization not found");
  }

  const { data: organization } = result;

  const teams = organization.teams;

  if (!teams.length) {
    redirect(`/${organization.slug}/settings/new-team`);
  }

  redirect(
    `/${organization.slug}/team/${organization?.teams[0]?.id}/issues/all`,
  );
  // } catch (error: any) {
  //   console.log(error);
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <Card className="mx-auto flex w-lg items-center justify-center">
  //         <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
  //           !
  //         </div>

  //         <h2 className="text-xl font-semibold">No Found</h2>

  //         <p className="text-muted-foreground mt-2 text-sm">{error?.message}</p>

  //         <div className="mt-6 flex items-center justify-center gap-3">
  //           <LinkButton href="/">Home</LinkButton>
  //         </div>
  //       </Card>
  //     </div>
  //   );
  // }
}
