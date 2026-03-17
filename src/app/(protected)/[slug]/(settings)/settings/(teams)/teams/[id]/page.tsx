"use client";
import TeamForm from "@/app/(protected)/[slug]/(dashboard)/_components/teams/form";
import { Card } from "@heroui/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTeam } from "@/hooks/use-teams";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { ArrowRight, UserSquare } from "lucide-react";
import DeleteTeams from "@/app/(protected)/[slug]/(settings)/settings/_components/delete-teams";

const TeamInfoPage = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const { data, isPending } = useTeam(id);
  const router = useRouter();

  if (isPending) {
    return <LoadingState label="Loading Team" />;
  }

  if (!data && !isPending) {
    return (
      <EmptyState
        icon={UserSquare}
        title="No Team Found"
        description="The team you're looking for doesn't exist."
        action={{
          label: "Home",
          onClick: () => router.push(`/${slug}/`),
        }}
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <main className="scrollbar-thin mx-auto min-h-0 w-full max-w-lg flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-white">{data?.name}</h1>
            </div>
          </div>
        </div>

        <div className="px-2">
          <Card className="p-0 px-2 pb-2">
            <Card.Content className="pt-3">
              <TeamForm defaultValue={data?.name} mode="edit" teamId={id} />
            </Card.Content>
          </Card>

          <Link className="mt-3" href={`/${slug}/settings/teams/${id}/members`}>
            <Card className="mt-4 w-full flex-row justify-between">
              <Card.Header>
                <Card.Title>Members</Card.Title>
                <Card.Description>View Team Members</Card.Description>
              </Card.Header>
              <Card.Footer>
                <ArrowRight />
              </Card.Footer>
            </Card>
          </Link>

          <Card className="mt-3 p-0 px-2">
            <Card.Content className="">
              <DeleteTeamCard
                teamId={data?.id ?? ""}
                orgId={data?.organizationId ?? ""}
              />
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeamInfoPage;

const DeleteTeamCard = ({
  teamId,
  orgId,
}: {
  orgId: string;
  teamId: string;
}) => {
  return (
    <Card className="w-full flex-row justify-between">
      <Card.Header>
        <Card.Title>Delete Team</Card.Title>
        <Card.Description>Delete your team permanently</Card.Description>
      </Card.Header>
      <Card.Footer>
        <DeleteTeams teamId={teamId ?? ""} orgId={orgId ?? ""} />
      </Card.Footer>
    </Card>
  );
};
