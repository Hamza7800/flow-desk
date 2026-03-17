"use client";
import { useProjectViewStore } from "@/store/project-view-store";
import { Dropdown, Button, Label, Checkbox } from "@heroui/react";
import { LayoutList, LayoutGrid, Settings2 } from "lucide-react";
import ViewChangeButton from "../view-change-button";

const DISPLAY_PROPERTY_LABELS = {
  showStatus: "Status",
  showPriority: "Priority",
  showAssignee: "Assignee",
  showLead: "Lead",
  showMembers: "Members",
  showCreatedAt: "Created",
  showUpdatedAt: "Updated",
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
    <div className="flex">
      <Dropdown>
        <Button variant="ghost" size="sm">
          <Settings2 />
          Display
        </Button>

        <Dropdown.Popover className="w-full max-w-[300px] overflow-hidden p-2">
          <div className="flex">
            <ViewChangeButton
              icon={<LayoutList />}
              label="List"
              mode="list"
              currentMode={viewMode}
              setMode={setViewMode}
            />

            <ViewChangeButton
              icon={<LayoutGrid />}
              label="Board"
              mode="board"
              currentMode={viewMode}
              setMode={setViewMode}
            />
          </div>
          <div className="pt-2">
            <p className="mb-2 text-xs text-zinc-500">Grouping</p>
            <div className="flex">
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

          <div>
            <p className="mb-2 pt-2 text-xs text-zinc-500">Properties</p>
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
