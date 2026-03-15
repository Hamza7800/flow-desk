"use client";

import { useOrganization } from "@/hooks/use-organizations";
import type { OrgType, UserOrgType } from "@/server-actions/organization";
import { Card, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LinkButton } from "../link-button";
import type { TeamsType } from "@/server-actions/teams";

const OrganizationContext = createContext<{
  org: OrgType["data"] | undefined;
} | null>(null);

type InitialData = {
  initialOrg: OrgType["data"];
};

const OrganizationProvider = ({
  initialData,
  children,
  slug,
}: {
  slug: string;
  initialData: InitialData;
  children: ReactNode;
}) => {
  const router = useRouter();
  const {
    data: org,
    isPending,
    isError,
    error,
  } = useOrganization(slug, initialData.initialOrg);

  const value = useMemo(
    () => ({
      org,
    }),
    [org, router],
  );

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="mx-auto flex w-lg items-center justify-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>

          <h2 className="text-xl font-semibold">No Found</h2>

          <p className="text-muted-foreground mt-2 text-sm">{error?.message}</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <LinkButton href="/">Home</LinkButton>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationProvider;

export const useOrganizationContext = () => {
  const ctx = useContext(OrganizationContext);
  if (!ctx)
    throw new Error("useOrganizationContext must be used within provider");
  return ctx;
};
