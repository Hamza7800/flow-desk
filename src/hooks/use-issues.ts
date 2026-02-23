import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IssueSchemaType } from "@/zod-schema/issue-schema";
import { createIssue, getIssues } from "@/server-actions/issues";
import { toast } from "@heroui/react";
import { queryKeys } from "@/lib/query-keys";

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

export const useTeamIssues = (orgId: string, teamId: string) => {
  return useQuery({
    queryKey: queryKeys.issues.byTeam(teamId),
    queryFn: async () => {
      const result = await getIssues(teamId);
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
    enabled: !!orgId && !!teamId,
  });
};
