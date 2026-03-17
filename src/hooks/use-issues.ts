import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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

export const useIssueDetails = (issueId: string, teamId: string) => {
  return useQuery({
    queryKey: queryKeys.issues.detail(issueId),
    queryFn: async () => {
      const result = await getIssue(issueId, teamId);
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
  });
};

export const useTeamIssues = (teamId: string) => {
  return useQuery({
    queryKey: queryKeys.issues.byTeam(teamId),
    queryFn: async () => {
      const result = await getIssues(teamId);
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
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
      const result = await getIssues(undefined, projectId);
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
    initialData,
  });
};

export const useUserAssignedIssues = () => {
  return useQuery({
    queryKey: queryKeys.issues.byUserAssigned(),
    queryFn: async () => {
      const result = await getUserAssignedIssues();
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
  });
};

export const useUserCreatedIssues = () => {
  return useQuery({
    queryKey: queryKeys.issues.byUserCreated(),
    queryFn: async () => {
      const result = await getUserCreatedIssues();
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
  });
};

const patchIssueInList = (
  old: IssueType["data"][],
  issueId: string,
  newValues: Partial<IssueType["data"]>,
) => {
  return (
    old?.map((issue) =>
      issue?.id === issueId
        ? {
            ...issue,
            ...newValues,
          }
        : issue,
    ) ?? old
  );
};

const removeIssueFromList = (old: IssueType["data"][], issueId: string) => {
  return old?.filter((issue) => issue?.id !== issueId) ?? old;
};

const resetIssueData = ({
  snapshots,
  issueId,
  teamId,
  projectId,
  queryClient,
}: {
  snapshots: {
    detail: unknown;
    byTeam: unknown;
    byProject: unknown;
    byUserAssigned: unknown;
    byUserCreated: unknown;
  };
  queryClient: QueryClient;
  issueId: string;
  teamId: string;
  projectId: string;
}) => {
  if (snapshots.detail)
    queryClient.setQueryData(
      queryKeys.issues.detail(issueId),
      snapshots.detail,
    );

  if (snapshots.byTeam)
    queryClient.setQueryData(queryKeys.issues.byTeam(teamId), snapshots.byTeam);

  if (snapshots.byProject)
    queryClient.setQueryData(
      queryKeys.issues.byProject(projectId),
      snapshots.byProject,
    );

  if (snapshots.byUserAssigned)
    queryClient.setQueryData(
      queryKeys.issues.byUserAssigned(),
      snapshots.byUserAssigned,
    );

  if (snapshots.byUserCreated)
    queryClient.setQueryData(
      queryKeys.issues.byUserCreated(),
      snapshots.byUserCreated,
    );
};

const getIssuesSnapshots = (
  queryClient: QueryClient,
  issueId: string,
  teamId: string,
  projectId: string,
) => {
  const snapshots = {
    detail: queryClient.getQueryData(queryKeys.issues.detail(issueId)),
    byTeam: queryClient.getQueryData(queryKeys.issues.byTeam(teamId)),
    byProject: queryClient.getQueryData(queryKeys.issues.byProject(projectId)),
    byUserAssigned: queryClient.getQueryData(queryKeys.issues.byUserAssigned()),
    byUserCreated: queryClient.getQueryData(queryKeys.issues.byUserCreated()),
  };
  return snapshots;
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
      const activeTeamId = teamId ?? "";
      const activeProjectId = projectId ?? "";

      await queryClient.cancelQueries({
        queryKey: queryKeys.issues.all,
      });

      const snapshots = getIssuesSnapshots(
        queryClient,
        issueId,
        activeTeamId,
        activeProjectId,
      );

      queryClient.setQueryData(
        queryKeys.issues.byTeam(activeTeamId),
        (old: IssueType["data"][]) => removeIssueFromList(old, issueId),
      );

      queryClient.setQueryData(
        queryKeys.issues.byProject(activeProjectId),
        (old: IssueType["data"][]) => removeIssueFromList(old, issueId),
      );

      queryClient.setQueryData(
        queryKeys.issues.byUserAssigned(),
        (old: IssueType["data"][]) => removeIssueFromList(old, issueId),
      );

      queryClient.setQueryData(
        queryKeys.issues.byUserCreated(),
        (old: IssueType["data"][]) => removeIssueFromList(old, issueId),
      );

      return { snapshots, issueId, activeTeamId, activeProjectId };
    },
    onError: (error, _, context) => {
      if (!context) return;
      const { snapshots, issueId, activeTeamId, activeProjectId } = context;

      resetIssueData({
        queryClient,
        snapshots,
        issueId,
        teamId: activeTeamId,
        projectId: activeProjectId,
      });

      toast.danger(error.message);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.all,
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
    }: {
      issueId: string;
      values: IssueUpdateSchemaType;
      teamId: string;
    }) => {
      const result = await updateIssue(issueId, values);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    onMutate: async ({
      issueId,
      teamId: mutationTeamId,
      values: newValues,
    }) => {
      const activeTeamId = mutationTeamId ?? teamId ?? "";
      const activeProjectId = projectId ?? "";

      await queryClient.cancelQueries({
        queryKey: queryKeys.issues.all,
      });

      const snapshots = getIssuesSnapshots(
        queryClient,
        issueId,
        activeTeamId,
        activeProjectId,
      );

      queryClient.setQueryData(
        queryKeys.issues.detail(issueId),
        (old: IssueType["data"]) => (old ? { ...old, ...newValues } : old),
      );

      queryClient.setQueryData(
        queryKeys.issues.byTeam(activeTeamId),
        (old: IssueType["data"][]) => patchIssueInList(old, issueId, newValues),
      );

      queryClient.setQueryData(
        queryKeys.issues.byProject(activeProjectId),
        (old: IssueType["data"][]) => patchIssueInList(old, issueId, newValues),
      );

      queryClient.setQueryData(
        queryKeys.issues.byUserAssigned(),
        (old: IssueType["data"][]) => patchIssueInList(old, issueId, newValues),
      );

      queryClient.setQueryData(
        queryKeys.issues.byUserCreated(),
        (old: IssueType["data"][]) => patchIssueInList(old, issueId, newValues),
      );

      return { snapshots, issueId, activeTeamId, activeProjectId };
    },
    onError: (error, _, context) => {
      if (!context) return;
      const { snapshots, issueId, activeTeamId, activeProjectId } = context;
      resetIssueData({
        queryClient,
        snapshots,
        issueId,
        teamId: activeTeamId,
        projectId: activeProjectId,
      });

      toast.danger(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.all,
      });

      toast.success("Update Success");
    },
  });
};
