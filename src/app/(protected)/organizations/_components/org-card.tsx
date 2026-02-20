"use client";
import { useSetOrgActive } from "@/hooks/use-organizations";
import { Card, Spinner } from "@heroui/react";

const OrganizationCard = ({
  org,
}: {
  org: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    logo?: string | null;
    metadata?: any;
  };
}) => {
  const action = useSetOrgActive();

  if (action.isPending) {
    return <Spinner />;
  }

  if (action.isError) {
    <h2>Unable to set Organization active</h2>;
  }
  return (
    <Card
      key={org.id}
      className="cursor-pointer"
      onClick={() => action.mutate({ id: org.id, slug: org.slug })}
    >
      <Card.Header>
        <Card.Title className="text-white">{org.name}</Card.Title>
        <Card.Description className="text-slate-400">
          /{org.slug}
        </Card.Description>
      </Card.Header>
      <Card.Content>
        {/* {org.description && (
                        <p className="text-slate-400 text-sm">{org.description}</p>
                      )} */}
        <p className="mt-4 text-xs text-slate-500">
          Created {new Date(org.createdAt).toLocaleDateString()}
        </p>
      </Card.Content>
    </Card>
  );
};

export default OrganizationCard;
