import { queryKeys } from "@/lib/query-keys";
import {
  createProject,
  getProjects,
  updateProject,
  type ProjectsType,
} from "@/server-actions/projects";
import type { ProjectSchemaType } from "@/zod-schema/project-schema";
import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProjectUpdateSchemaType } from "@/zod-schema/project-schema";

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
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all,
      });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.danger(error.message);
    },
  });
};

export const useUpdateProjects = (orgId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      values,
      teamId,
    }: {
      projectId: string;
      teamId: string;
      values: ProjectUpdateSchemaType;
    }) => {
      const result = await updateProject({ projectId, values });
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onMutate: async ({ projectId, teamId, values: newValues }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.projects.all,
      });

      const previousProjects = queryClient.getQueryData(
        queryKeys.projects.teamList(orgId, teamId),
      );

      queryClient.setQueryData(
        queryKeys.projects.teamList(orgId, teamId),
        (old: any[]) =>
          old?.map((project) =>
            project.id === projectId ? { ...project, ...newValues } : project,
          ) ?? old,
      );

      return { previousProjects, teamId, projectId };
    },
    onError: (error, _, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(
          queryKeys.projects.teamList(orgId, context.teamId),
          context.previousProjects,
        );
      }

      toast.danger(error.message);
    },
    onSuccess: (_) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all,
      });

      toast.success("Update Success");
    },
  });
};

export const useOrgProjects = (
  orgId: string | undefined,
  initialData?: ProjectsType["data"],
) => {
  return useQuery({
    queryKey: queryKeys.projects.orgList(orgId ?? "no-org"),
    queryFn: async () => {
      const result = await getProjects();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    enabled: !!orgId,
    initialData,
  });
};

export const useTeamProjects = (
  orgId: string | undefined,
  teamId: string | undefined,
  initialData?: ProjectsType["data"],
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
    // enabled: !!orgId && !!teamId,
    initialData,
  });
};
