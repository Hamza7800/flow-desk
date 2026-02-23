import { Card } from "@heroui/react";
import DeleteWorkspace from "./delete-workspace";

const DeleteWorkspaceCard = () => {
  return (
    <div className="w-full space-y-2">
      <h2>Danger Zone</h2>
      <Card className="w-full flex-row justify-between">
        <Card.Header>
          <Card.Title>Delete Workspace</Card.Title>
          <Card.Description>Delete your workspace permanently</Card.Description>
        </Card.Header>
        <Card.Footer>
          <DeleteWorkspace />
        </Card.Footer>
      </Card>
    </div>
  );
};

export default DeleteWorkspaceCard;
