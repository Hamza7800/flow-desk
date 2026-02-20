import {
  createOrganization,
  getOrganization,
  getUserListOrganizations,
  setActiveOrganization,
  type OrgType,
} from "@/server-actions/organization";
import { authClient } from "@/server/better-auth/client";
import type { OrganizationSchemaType } from "@/zod-schema/organization-schema";
import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const queryKeys = {
  organizations: {
    all: ["organizations"] as const,
    list: () => [...queryKeys.organizations.all, "list"] as const,
    detail: (slug: string) =>
      [...queryKeys.organizations.all, "detail", slug] as const,
  },

  projects: {
    all: ["projects"] as const,
    list: (orgId: string) =>
      [...queryKeys.projects.all, "list", orgId] as const,
  },

  issues: {
    all: ["issues"] as const,
    list: (orgId: string) => [...queryKeys.issues.all, "list", orgId] as const,
  },
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: OrganizationSchemaType) => {
      const result = await createOrganization(values);
      if (!result.success) {
        throw new Error(result.error || "Failed to create organization");
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      });

      toast.success(data.message);
      router.push(`/${data.data?.slug}`);
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};

export const useOrganization = (
  slug: string | undefined,
  org?: OrgType["organization"],
) => {
  return useQuery({
    queryKey: queryKeys.organizations.detail(slug || "no-slug"),
    queryFn: async () => {
      if (!slug) {
        throw new Error("No Organization found");
      }
      const result = await getOrganization(slug);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.organization;
    },
    enabled: !!slug,
    initialData: org,
  });
};

export const useOrganizationsList = () => {
  return useQuery({
    queryKey: queryKeys.organizations.list(),
    queryFn: async () => {
      const result = await getUserListOrganizations();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
  });
};

export const useSetOrgActive = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, slug }: { id: string; slug: string }) => {
      const { data, error } = await authClient.organization.setActive({
        organizationId: id,
        organizationSlug: slug,
      });
      // const result = await setActiveOrganization(id, slug);
      if (!data) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      });

      toast.success(`${data.name} org set active`);
      router.replace(`/${data?.slug}`);
      // router.refresh();
      // window.location.href = `/${data.data?.slug}`;
    },

    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
