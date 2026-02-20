import { LinkButton } from "@/components/link-button";
import { getUserListOrganizations } from "@/server-actions/organization";
import { Card, DangerIcon } from "@heroui/react";
import OrganizationCard from "./_components/org-card";

const UserOrganizations = async () => {
  try {
    const result = await getUserListOrganizations();
    if (!result.success) {
      throw new Error(result.message);
    }
    if (!result.data?.length) {
      throw new Error("No Organizations for user");
    }

    const organizations = result.data;

    return (
      <div className="h-screen p-10">
        <h2 className="mb-2">Select you organization</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} org={org} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <Card>
        <Card.Header>
          <DangerIcon className="size-5" />
          <Card.Header>No Organizations</Card.Header>
        </Card.Header>
        <Card.Content>
          <p className="mt-1">
            This action will delete your workspace and all the data including
            members, teams, projects and all related data
          </p>
        </Card.Content>
        <Card.Footer>
          <LinkButton href="/onboarding" variant="tertiary">
            Create
          </LinkButton>
          <LinkButton href="/">Home</LinkButton>
        </Card.Footer>
      </Card>
    );
  }
};

export default UserOrganizations;
