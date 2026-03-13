import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  IssueSchemaType,
  IssueUpdateSchemaType,
} from "@/zod-schema/issue-schema";
import {
  createIssue,
  deleteIssue,
  getIssue,
  getIssues,
  getUserAssignedIssues,
  getUserCreatedIssues,
  updateIssue,
  type IssuesType,
  type IssueType,
} from "@/server-actions/issues";
import { toast } from "@heroui/react";
import { queryKeys } from "@/lib/query-keys";
import type { IssueSnapshot } from "@/lib/types";

// TODO: FIX BUG FOR REFETCHING ISSUES ON UPDATE
export const useCreateIssue = (organizationId: string, teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: IssueSchemaType) => {
      const result = await createIssue(teamId, values);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.danger(error.message);
    },
  });
};

export const useOrgIssues = (orgId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.issues.orgList(orgId ?? "no-org"),
    queryFn: async () => {
      const result = await getIssues();
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
  });
};

export const useIssueDetails = (
  issueId: string,
  teamId: string,
  initialData?: IssueType["data"],
) => {
  return useQuery({
    queryKey: queryKeys.issues.detail(issueId),
    queryFn: async () => {
      const result = await getIssue(issueId, teamId);
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
    initialData,
  });
};

export const useTeamIssues = (
  teamId: string,
  initialData?: IssuesType["data"],
) => {
  return useQuery({
    queryKey: queryKeys.issues.byTeam(teamId),
    queryFn: async () => {
      const result = await getIssues(teamId);
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
    initialData,
  });
};

export const useProjectIssues = (
  teamId: string,
  projectId: string,
  initialData?: IssuesType["data"],
) => {
  return useQuery({
    queryKey: queryKeys.issues.byProject(projectId),
    queryFn: async () => {
      const result = await getIssues(teamId, projectId);
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
    initialData,
  });
};

export const useUserAssignedIssues = (initialData?: IssuesType["data"]) => {
  return useQuery({
    queryKey: queryKeys.issues.byUserAssigned(),
    queryFn: async () => {
      const result = await getUserAssignedIssues();
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
    initialData,
  });
};

export const useUserCreatedIssues = (initialData?: IssuesType["data"]) => {
  return useQuery({
    queryKey: queryKeys.issues.byUserCreated(),
    queryFn: async () => {
      const result = await getUserCreatedIssues();
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
    initialData,
  });
};

export const useDeleteIssue = (teamId: string, projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      const result = await deleteIssue(issueId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onMutate: async (issueId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.issues.byTeam(teamId),
      });

      const previousIssues = queryClient.getQueryData(
        queryKeys.issues.byTeam(teamId),
      );

      let previousProjectIssues;
      if (projectId) {
        previousProjectIssues = queryClient.getQueryData(
          queryKeys.issues.byProject(projectId),
        );
      }

      queryClient.setQueryData(
        queryKeys.issues.byTeam(teamId),
        (old: any[]) => {
          return old?.filter((issue) => issue.id !== issueId) ?? old;
        },
      );

      if (projectId) {
        queryClient.setQueryData(
          queryKeys.issues.byProject(projectId),
          (old: any[]) => {
            return old?.filter((issue) => issue.id !== issueId) ?? old;
          },
        );
      }

      return { previousIssues, previousProjectIssues };
    },
    onError: (error, _, context) => {
      if (context?.previousIssues) {
        queryClient.setQueryData(
          queryKeys.issues.byTeam(teamId),
          context.previousIssues,
        );
      }

      if (context?.previousProjectIssues && projectId) {
        queryClient.setQueryData(
          queryKeys.issues.byProject(projectId),
          context.previousProjectIssues,
        );
      }

      toast.danger(error.message);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.byTeam(teamId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.byUserAssigned(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.byUserCreated(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.byProject(projectId ?? ""),
      });
      toast.success("Issue Deleted");
    },
  });
};

export const useUpdateIssue = ({ orgId, teamId, projectId }: IssueSnapshot) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      issueId,
      values,
      teamId,
    }: {
      issueId: string;
      values: IssueUpdateSchemaType;
      teamId: string;
    }) => {
      const result = await updateIssue(issueId, values);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onMutate: async ({ issueId, teamId, values: newValues }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.issues.detail(issueId),
      });

      await queryClient.cancelQueries({
        queryKey: queryKeys.issues.byTeam(teamId ?? ""),
      });

      await queryClient.cancelQueries({
        queryKey: queryKeys.issues.byProject(projectId ?? ""),
      });

      const previousIssue = queryClient.getQueryData(
        queryKeys.issues.detail(issueId),
      );

      const previousList = queryClient.getQueryData(
        queryKeys.issues.byTeam(teamId ?? ""),
      );

      const previousProjectIssuesList = queryClient.getQueryData(
        queryKeys.issues.byProject(projectId ?? ""),
      );

      queryClient.setQueryData(queryKeys.issues.detail(issueId), (old: any) =>
        old ? { ...old, ...newValues } : old,
      );

      queryClient.setQueryData(
        queryKeys.issues.byTeam(teamId ?? ""),
        (old: any[]) =>
          old?.map((issue) =>
            issue.id === issueId ? { ...issue, ...newValues } : issue,
          ) ?? old,
      );

      queryClient.setQueryData(
        queryKeys.issues.byProject(projectId ?? ""),
        (old: any[]) => old?.filter((issue) => issue.id !== issueId) ?? old,
      );

      return {
        previousIssue,
        previousProjectIssuesList,
        previousList,
        issueId,
        teamId,
      };
    },
    onError: (error, _, context) => {
      if (context?.previousIssue) {
        queryClient.setQueryData(
          queryKeys.issues.detail(context.issueId),
          context.previousIssue,
        );
      }
      if (context?.previousList) {
        queryClient.setQueryData(
          queryKeys.issues.byTeam(context.teamId ?? ""),
          context.previousList,
        );
      }
      if (context?.previousProjectIssuesList) {
        queryClient.setQueryData(
          queryKeys.issues.byProject(projectId ?? ""),
          context.previousProjectIssuesList,
        );
      }
      toast.danger(error.message);
    },
    onSuccess: (data, { issueId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.detail(issueId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.all,
      });

      if (data?.projectId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.issues.byProject(data?.projectId),
        });
      }
      toast.success("Update Success");
    },
  });
};
