"use client";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  type Priority,
  type Status,
} from "@/lib/contants";
import { useIssueViewStore } from "@/store/issue-view-store";
import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CreateIssueModal } from "./create-issue";

const CreateIssueButton = ({ label }: { label: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { teamId, projectId } = useParams<{
    teamId: string;
    projectId?: string;
  }>();
  const { groupBy } = useIssueViewStore();

  const getDefaultValue = () => {
    const baseDefaults = {
      priority: "low" as Priority,
      status: "backlog" as Status,
    };

    switch (groupBy) {
      case "priority":
        const foundPriority = PRIORITY_OPTIONS.find((p) => p.label === label)
          ?.key as Priority;

        return {
          ...baseDefaults,
          priority: foundPriority ?? baseDefaults.priority,
        };
      case "status":
        const foundStatus = STATUS_OPTIONS.find((s) => s.label === label)
          ?.key as Status;
        return {
          ...baseDefaults,
          status: foundStatus ?? baseDefaults.status,
        };
      default:
        return baseDefaults;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className={"h-full"}
        isIconOnly
        onPress={() => setIsOpen(true)}
      >
        <PlusIcon />
      </Button>
      <CreateIssueModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        defaultValues={{
          ...getDefaultValue(),
          projectId,
        }}
        teamId={teamId}
      />
    </>
  );
};

export default CreateIssueButton;
