"use client";
import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CreateProjectModal } from "./create-project";

const CreateProjectButton = ({ text }: { text?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { teamId } = useParams<{ teamId: string }>();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        // className={"h-full"}
        // isIconOnly
        onPress={() => setIsOpen(true)}
      >
        <PlusIcon />
        <span>{text}</span>
      </Button>
      <CreateProjectModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        teamId={teamId}
      />
    </>
  );
};

export default CreateProjectButton;
