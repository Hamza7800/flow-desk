import { queryKeys } from "@/lib/query-keys";
import {
  createOrganization,
  deleteOrganization,
  getOrganization,
  getUserListOrganizations,
  removeMemberFromOrg,
  setActiveOrganization,
  updateOrganization,
  type OrgType,
  type UserOrgType,
} from "@/server-actions/organization";
import { authClient } from "@/server/better-auth/client";
import type { OrganizationSchemaType } from "@/zod-schema/organization-schema";
import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: OrganizationSchemaType) => {
      const result = await createOrganization(values);
      if (!result.success) {
        throw new Error(result.message || "Failed to create organization");
      }

      const { error } = await authClient.organization.setActive({
        organizationId: result.data?.id,
        organizationSlug: result.data?.slug,
      });

      if (error) {
        throw new Error(error.message || "Failed to set organization active");
      }

      return result;
    },
    onSuccess: (data) => {
      // queryClient.setQueryData(queryKeys.organizations.all, (old: any) => {
      //   return old ? [...old, data.data] : [data.data];
      // });

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
  initialData?: OrgType["data"],
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
      return result.data;
    },
    enabled: !!slug,
    initialData,
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
    // initialData,
  });
};

export const useSetOrgActive = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, slug }: { id: string; slug: string }) => {
      // await authClient.organization.setActive({
      //   organizationId: id,
      //   organizationSlug: slug,
      // });
      const result = await authClient.organization.setActive({
        organizationId: id,
        organizationSlug: slug,
      });

      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.clear();

      toast.success(`${data?.name} org set active`);
      // router.replace(`/${data?.slug}`);

      // router.refresh();
      window.location.href = `/${data?.slug}`;
    },

    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};

export const useOrganizationDelete = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const result = await deleteOrganization(slug);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      });

      toast.success(data.message);
      router.replace("/organizations");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};

export const useUpdateOrganization = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: OrganizationSchemaType;
    }) => {
      const result = await updateOrganization(id, values);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      });
      toast.success(data.message);
      router.replace(`/${data?.data?.slug}/settings/workspace`);
    },
    onError: (error) => {
      toast.danger(error.message);
    },
  });
};

export const useRemoveMember = (actionType: "leave" | "remove") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await removeMemberFromOrg(userId, actionType);
      if (!result.success)
        throw new Error(result.message || "Failed to remove from org");
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      });

      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
