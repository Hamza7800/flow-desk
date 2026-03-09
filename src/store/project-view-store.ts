import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewMode = "list" | "board";
export type GroupBy = "status" | "priority";

export type DisplayProperties = {
  showStatus: boolean;
  showPriority: boolean;
  showLead: boolean;
  showMembers: boolean;
  showCreatedAt: boolean;
  showUpdatedAt: boolean;
};

type ProjectViewState = {
  viewMode: ViewMode;
  groupBy: GroupBy;
  displayProperties: DisplayProperties;
  setViewMode: (mode: ViewMode) => void;
  setGroupBy: (groupBy: GroupBy) => void;
  toggleDisplayProperty: (key: keyof DisplayProperties) => void;
};

export const useProjectViewStore = create<ProjectViewState>()(
  persist(
    (set) => ({
      viewMode: "list",
      groupBy: "status",
      displayProperties: {
        showStatus: true,
        showPriority: true,
        showLead: true,
        showMembers: true,
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
    { name: "project-view-store" },
  ),
);
