import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IssueSchemaType } from "@/zod-schema/issue-schema";
import { createIssue } from "@/server-actions/issues";
import { toast } from "@heroui/react";
import { queryKeys } from "@/lib/query-keys";

export const useCreateIssue = (organizationId: string, teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: IssueSchemaType) => {
      const result = await createIssue(organizationId, teamId, values);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: ["issues", "list", organizationId] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.list(organizationId),
      });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.danger(error.message);
    },
  });
};
