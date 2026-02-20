"use client";
import OrganizationForm from "@/components/forms/organization-form";
import { useOrganization } from "@/hooks/use-organizations";
import { Card, Spinner } from "@heroui/react";

const Form = ({ slug }: { slug: string }) => {
  const {
    data: organization,
    isLoading,
    isError,
    error,
  } = useOrganization(slug);

  if (isLoading) {
    return (
      <Card className="items-center">
        <Spinner />
      </Card>
    );
  }

  if (isError || !organization) {
    return (
      <Card>
        <Card.Content>
          <Card.Header>No Organization found</Card.Header>
          <Card.Description>{error?.message}</Card.Description>
        </Card.Content>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-2">
      <h2>Workspace</h2>
      <Card>
        <OrganizationForm
          mode="edit"
          initialData={organization}
          organizationId={organization.id}
        />
      </Card>
    </div>
  );
};

export default Form;
