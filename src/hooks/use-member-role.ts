import { useOrganizationContext } from "@/components/context/organization-client-context";
import { queryKeys } from "@/lib/query-keys";
import {
  getCurrentMemberRole,
  getProjectLead,
  updateMemberRole,
} from "@/server-actions/members";
import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCurrentMemberRole = () => {
  const { org } = useOrganizationContext();

  return useQuery({
    queryKey: queryKeys.members.role(org?.id ?? ""),
    queryFn: async () => {
      const result = await getCurrentMemberRole();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();
  const { org } = useOrganizationContext();

  return useMutation({
    mutationFn: async ({
      memberId,
      role,
    }: {
      memberId: string;
      role: "admin" | "member";
    }) => {
      const result = await updateMemberRole(memberId, role);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.members.list(org?.id ?? ""),
      });
      toast.success("Role updated");
    },

    onError: (error: Error) => {
      toast.danger(error.message ?? "Failed to update role");
    },
  });
};

export const useProjectLead = (projectId: string) => {
  return useQuery({
    queryKey: queryKeys.projects.projectLead(projectId),
    queryFn: async () => {
      const result = await getProjectLead(projectId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
  });
};
