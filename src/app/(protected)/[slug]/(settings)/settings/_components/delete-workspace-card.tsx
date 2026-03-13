import { Card } from "@heroui/react";
import DeleteWorkspace from "./delete-workspace";

const DeleteWorkspaceCard = () => {
  return (
    <Card className="w-full flex-row justify-between">
      <Card.Header>
        <Card.Title>Delete Workspace</Card.Title>
        <Card.Description>Delete your workspace permanently</Card.Description>
      </Card.Header>
      <Card.Footer>
        <DeleteWorkspace />
      </Card.Footer>
    </Card>
  );
};

export default DeleteWorkspaceCard;
