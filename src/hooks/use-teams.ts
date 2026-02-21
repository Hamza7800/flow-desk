import { queryKeys } from "@/lib/query-keys";
import {
  createTeam,
  getOrgTeams,
  getUserTeams,
  removeTeam,
  setActiveTeam,
  updateTeam,
} from "@/server-actions/teams";
import type { TeamSchemaType } from "@/zod-schema/teams-schema";
import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useOrgTeams = (orgId: string) => {
  return useQuery({
    queryKey: queryKeys.teams.orgList(orgId || "no-org"),
    queryFn: async () => {
      if (!orgId) throw new Error("No organization ID provided");

      const result = await getOrgTeams(orgId);

      if (!result.success) throw new Error(result.message);
      return result;
    },
    enabled: !!orgId,
  });
};

export const useUserTeams = (orgId: string) => {
  return useQuery({
    queryKey: queryKeys.teams.userList(),
    queryFn: async () => {
      if (!orgId) throw new Error("No organization ID provided");
      const result = await getUserTeams(orgId);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    enabled: !!orgId,
  });
};

export const useCreateTeam = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: TeamSchemaType) => {
      const result = await createTeam(orgId, values);
      if (!result.success)
        throw new Error(result.message || "Failed to create team");
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.orgList(orgId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.userList() });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};

export const useUpdateTeam = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      values,
    }: {
      teamId: string;
      values: TeamSchemaType;
    }) => {
      const result = await updateTeam(teamId, values);
      if (!result.success)
        throw new Error(result.message || "Failed to update team");
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.orgList(orgId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.userList() });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};

export const useRemoveTeam = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      const result = await removeTeam(teamId, orgId);
      if (!result.success)
        throw new Error(result.message || "Failed to remove team");
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.orgList(orgId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.userList() });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};

export const useSetActiveTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      const result = await setActiveTeam(teamId);
      if (!result.success)
        throw new Error(result.message || "Failed to set active team");
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.all });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
