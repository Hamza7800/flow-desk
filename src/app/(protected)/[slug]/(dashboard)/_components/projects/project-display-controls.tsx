"use client";
import { useProjectViewStore } from "@/store/project-view-store";
import { Dropdown, Button, Label, Checkbox } from "@heroui/react";
import { LayoutList, LayoutGrid, Settings2 } from "lucide-react";

const DISPLAY_PROPERTY_LABELS = {
  showStatus: "Status",
  showPriority: "Priority",
  showAssignee: "Assignee",
  showLead: "Lead",
  showMembers: "Members",
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
  } = useProjectViewStore();

  return (
    <div className="flex items-center gap-2">
      {/* View mode toggle */}
      <div className="flex gap-2">
        <Button
          onClick={() => setViewMode("list")}
          variant={viewMode === "list" ? "danger" : "ghost"}
        >
          <LayoutList size={16} />
        </Button>
        <Button
          onClick={() => setViewMode("board")}
          variant={viewMode === "board" ? "danger" : "ghost"}
        >
          <LayoutGrid size={16} />
        </Button>
      </div>

      {/* Display options popover */}
      <Dropdown>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Settings2 size={14} />
          Display
        </Button>

        <Dropdown.Popover className="w-64 space-y-4">
          {/* Grouping */}
          <div className="p-3">
            <p className="mb-2 text-xs text-zinc-500">Grouping</p>
            <div className="flex gap-1">
              {GROUPBY_OPTIONS.map((opt) => (
                <Button
                  fullWidth
                  key={opt.key}
                  onClick={() => setGroupBy(opt.key)}
                  variant={groupBy === opt.key ? "danger" : "ghost"}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Display properties */}
          <div>
            <p className="mb-2 px-3 text-xs text-zinc-500">Properties</p>
            <div className="">
              {Object.entries(DISPLAY_PROPERTY_LABELS).map(([key, label]) => (
                <Checkbox
                  className={
                    "w-full justify-between px-3 py-2 hover:bg-[#1c1c1c]"
                  }
                  key={key}
                  id={key}
                  isSelected={
                    displayProperties[key as keyof typeof displayProperties]
                  }
                  onChange={() => {
                    toggleDisplayProperty(
                      key as keyof typeof displayProperties,
                    );
                  }}
                >
                  <Checkbox.Content>
                    <Label htmlFor={key}>{label}</Label>
                  </Checkbox.Content>
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                </Checkbox>
              ))}
            </div>
          </div>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
};
