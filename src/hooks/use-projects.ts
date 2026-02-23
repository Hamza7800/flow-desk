import { queryKeys } from "@/lib/query-keys";
import { createProject, getProjects } from "@/server-actions/projects";
import type { ProjectSchemaType } from "@/zod-schema/project-schema";
import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateProject = (orgId: string, teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ProjectSchemaType) => {
      const result = await createProject({ teamId, values });
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.orgList(orgId),
      });
      if (teamId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.teamList(orgId, teamId),
        });
      }
      toast.success(data.message);
    },
    onError: (error) => {
      toast.danger(error.message);
    },
  });
};

export const useOrgProject = (orgId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.projects.orgList(orgId ?? "no-org"),
    queryFn: async () => {
      const result = await getProjects();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    enabled: !!orgId,
  });
};

export const useTeamProjects = (
  orgId: string | undefined,
  teamId: string | undefined,
) => {
  return useQuery({
    queryKey: queryKeys.projects.teamList(
      orgId ?? "no-org",
      teamId ?? "no-team",
    ),
    queryFn: async () => {
      const result = await getProjects(teamId);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    enabled: !!orgId && !!teamId,
  });
};
