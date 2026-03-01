import { GROUP_CONFIG, type Issues } from "@/lib/issue-config/issue-groups";
import type { IssuesType } from "@/server-actions/issues";
import { type GroupBy } from "@/store/issue-view-store";
import { useMemo } from "react";

export type GroupedIssues = {
  key: string;
  label: string;
  icon: string;
  color: string;
  issues: Issues;
}[];

export const useGroupedIssues = (
  issues: NonNullable<IssuesType["data"]>,
  groupBy: GroupBy,
): GroupedIssues => {
  return useMemo(() => {
    if (!issues) return [];

    const configs = GROUP_CONFIG[groupBy];

    return configs.map((config) => ({
      ...config,
      issues: issues.filter((issue) => issue[groupBy] === config.key),
    }));
  }, [issues, groupBy]);
};
