import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  IssueSchemaType,
  IssueUpdateSchemaType,
} from "@/zod-schema/issue-schema";
import {
  createIssue,
  deleteIssue,
  getIssues,
  updateIssue,
  type IssuesType,
} from "@/server-actions/issues";
import { toast } from "@heroui/react";
import { queryKeys } from "@/lib/query-keys";
import type { IssueSnapshot } from "@/lib/types";

export const useCreateIssue = (organizationId: string, teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: IssueSchemaType) => {
      const result = await createIssue(teamId, values);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: ["issues", "list", organizationId] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.orgList(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.byTeam(teamId),
      });
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
    enabled: !!orgId,
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
    enabled: !!teamId,
  });
};

export const useDeleteIssue = (teamId: string) => {
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

      queryClient.setQueryData(
        queryKeys.issues.byTeam(teamId),
        (old: any[]) => {
          return old.filter((issue) => issue.id !== issueId);
        },
      );

      return { previousIssues };
    },
    onError: (error, _, context) => {
      if (context?.previousIssues) {
        queryClient.setQueryData(
          queryKeys.issues.byTeam(teamId),
          context.previousIssues,
        );
      }
      toast.danger(error.message);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.byTeam(teamId),
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

      const previousIssue = queryClient.getQueryData(
        queryKeys.issues.detail(issueId),
      );
      const previousList = queryClient.getQueryData(
        queryKeys.issues.byTeam(teamId ?? ""),
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

      return { previousIssue, previousList, issueId, teamId };
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
      toast.danger(error.message);
    },
    onSuccess: (_, { issueId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.detail(issueId),
      });
      toast.success("Update Success");
    },
  });
};
