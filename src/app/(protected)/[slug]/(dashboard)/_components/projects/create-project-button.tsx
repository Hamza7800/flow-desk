import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CreateProjectModal } from "./create-project";

const CreateProjectButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { teamId } = useParams<{ teamId: string }>();

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
      <CreateProjectModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        teamId={teamId}
      />
    </>
  );
};

export default CreateProjectButton;
