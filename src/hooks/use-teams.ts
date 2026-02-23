import { queryKeys } from "@/lib/query-keys";
import {
  addMemberToTeam,
  createTeam,
  getOrgTeams,
  getTeam,
  getUserTeams,
  getUserTeamsCurrentOrg,
  removeMemberFromTeam,
  removeTeam,
  setActiveTeam,
  updateTeam,
  type TeamsType,
} from "@/server-actions/teams";
import type { TeamSchemaType } from "@/zod-schema/teams-schema";
import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useOrgTeams = (orgId: string, initialData?: TeamsType["data"]) => {
  return useQuery({
    queryKey: queryKeys.teams.orgList(orgId),
    queryFn: async () => {
      const result = await getOrgTeams();

      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    enabled: !!orgId,
    initialData: initialData || [],
  });
};

export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: queryKeys.teams.detail(teamId),
    queryFn: async () => {
      const result = await getTeam(teamId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    enabled: !!teamId,
  });
};

export const useUserTeams = () => {
  return useQuery({
    // queryKey: queryKeys.teams.userList(orgId),
    queryKey: queryKeys.teams.userList(),
    queryFn: async () => {
      const result = await getUserTeamsCurrentOrg();
      if (!result.success) throw new Error(result.message);
      return result;
    },
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
      queryClient.invalidateQueries({
        // queryKey: queryKeys.teams.userList(orgId),
        queryKey: queryKeys.teams.userList(),
      });
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
      queryClient.invalidateQueries({
        // queryKey: queryKeys.teams.userList(orgId),
        queryKey: queryKeys.teams.userList(),
      });
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.userList(),
      });
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

export const useAddMemberToTeam = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      const result = await addMemberToTeam(teamId);
      if (!result.success)
        throw new Error(result.message || "Failed to join team");
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.orgList(orgId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.userList(),
      });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};

export const useRemoveMemberFromTeam = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      const result = await removeMemberFromTeam(teamId);
      if (!result.success)
        throw new Error(result.message || "Failed to leave team");
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.orgList(orgId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.userList(),
      });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
