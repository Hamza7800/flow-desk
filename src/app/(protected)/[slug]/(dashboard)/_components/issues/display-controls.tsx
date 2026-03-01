import { cn } from "@/lib/utils";
import { useIssueViewStore } from "@/store/issue-view-store";
import { Dropdown, Button } from "@heroui/react";
import { LayoutList, LayoutGrid, Settings2 } from "lucide-react";

const DISPLAY_PROPERTY_LABELS = {
  showStatus: "Status",
  showPriority: "Priority",
  showAssignee: "Assignee",
  showProject: "Project",
  showLabels: "Labels",
  showDueDate: "Due Date",
} as const;

const GROUPBY_OPTIONS = [
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
] as const;

export const DisplayControls = () => {
  const {
    viewMode,
    setViewMode,
    groupBy,
    setGroupBy,
    displayProperties,
    toggleDisplayProperty,
  } = useIssueViewStore();

  return (
    <div className="flex items-center gap-2">
      {/* View mode toggle */}
      <div className="flex rounded-md border border-zinc-700">
        <button
          onClick={() => setViewMode("list")}
          className={cn(
            "rounded-l-md p-1.5 transition-colors",
            viewMode === "list"
              ? "bg-zinc-700 text-white"
              : "text-zinc-400 hover:text-white",
          )}
        >
          <LayoutList size={16} />
        </button>
        <button
          onClick={() => setViewMode("board")}
          className={cn(
            "rounded-r-md p-1.5 transition-colors",
            viewMode === "board"
              ? "bg-zinc-700 text-white"
              : "text-zinc-400 hover:text-white",
          )}
        >
          <LayoutGrid size={16} />
        </button>
      </div>

      {/* Display options popover */}
      <Dropdown>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Settings2 size={14} />
          Display
        </Button>

        <Dropdown.Popover className="w-64 space-y-4 p-3">
          {/* Grouping */}
          <div>
            <p className="mb-2 text-xs text-zinc-500">Grouping</p>
            <div className="flex gap-1">
              {GROUPBY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setGroupBy(opt.key)}
                  className={cn(
                    "flex-1 rounded px-2 py-1 text-sm transition-colors",
                    groupBy === opt.key
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:bg-zinc-800",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Display properties */}
          <div>
            <p className="mb-2 text-xs text-zinc-500">Properties</p>
            <div className="space-y-1">
              {Object.entries(DISPLAY_PROPERTY_LABELS).map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center justify-between py-1"
                >
                  <span className="text-sm text-zinc-300">{label}</span>
                  <input
                    type="checkbox"
                    checked={
                      displayProperties[key as keyof typeof displayProperties]
                    }
                    onChange={() =>
                      toggleDisplayProperty(
                        key as keyof typeof displayProperties,
                      )
                    }
                    className="rounded border-zinc-600"
                  />
                </label>
              ))}
            </div>
          </div>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
};
