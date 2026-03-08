import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewMode = "list" | "board";
export type GroupBy = "status" | "priority";

export type DisplayProperties = {
  showStatus: boolean;
  showPriority: boolean;
  showAssignee: boolean;
  showProject: boolean;
  showLabels: boolean;
  showCreatedAt: boolean;
  showUpdatedAt: boolean;
};

type IssueViewState = {
  viewMode: ViewMode;
  groupBy: GroupBy;
  displayProperties: DisplayProperties;
  setViewMode: (mode: ViewMode) => void;
  setGroupBy: (groupBy: GroupBy) => void;
  toggleDisplayProperty: (key: keyof DisplayProperties) => void;
};

export const useIssueViewStore = create<IssueViewState>()(
  persist(
    (set) => ({
      viewMode: "list",
      groupBy: "status",
      displayProperties: {
        showStatus: true,
        showPriority: true,
        showAssignee: true,
        showProject: true,
        showLabels: true,
        showCreatedAt: true,
        showUpdatedAt: true,
      },

      setViewMode: (viewMode) => set({ viewMode }),
      setGroupBy: (groupBy) => set({ groupBy }),

      toggleDisplayProperty: (key) => {
        set((state) => ({
          displayProperties: {
            ...state.displayProperties,
            [key]: !state.displayProperties[key],
          },
        }));
      },
    }),
    { name: "issue-view-store" },
  ),
);
