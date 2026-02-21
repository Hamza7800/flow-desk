import {
  acceptInvitation,
  cancelInvitation,
  getUserInvites,
  inviteUserToWorkspace,
  rejectInvitation,
} from "@/server-actions/invitations";
import type { InviteType } from "@/zod-schema/invite-schema";
import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./use-organizations";

export const invitationKeys = {
  all: ["invitations"] as const,
  org: (orgId: string) => ["invitations", orgId] as const,
  list: (orgId: string) => ["invitations", orgId, "list"] as const,
};

export const useSendInvitation = (orgId: string, slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: InviteType) => {
      const result = await inviteUserToWorkspace(orgId, values);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: invitationKeys.org(orgId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.detail(slug),
      });

      toast.success(data.message);
    },
    onError: (error) => {
      toast.danger(error.message);
    },
  });
};

export const useAcceptInvitation = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      const result = await acceptInvitation(inviteId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: invitationKeys.org(slug),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.detail(slug),
      });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.danger(error.message);
    },
  });
};

export const useCancelInvitation = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      const result = await cancelInvitation(inviteId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: invitationKeys.org(slug),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.detail(slug),
      });

      toast.success(data.message);
    },
    onError: (error) => {
      toast.danger(error.message);
    },
  });
};

// export const useOrganizationInvitations = (orgId: string) => {
//   return useQuery({
//     queryKey: invitationKeys.list(orgId),
//     queryFn: () => getAllInvites(),
//     enabled: !!orgId,
//   });
// };

export const useUserInvitations = (orgId: string) => {
  return useQuery({
    queryKey: invitationKeys.list(orgId),
    queryFn: async () => {
      const result = await getUserInvites();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    enabled: !!orgId,
  });
};

export const useRejectInvitation = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      const result = await rejectInvitation(inviteId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: invitationKeys.org(slug),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.detail(slug),
      });

      toast.success(data.message);
    },
    onError: (error) => {
      toast.danger(error.message);
    },
  });
};
