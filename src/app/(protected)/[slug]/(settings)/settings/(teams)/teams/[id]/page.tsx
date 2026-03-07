"use client";
import TeamForm from "@/app/(protected)/[slug]/(dashboard)/_components/teams/form";
import { Card, Spinner } from "@heroui/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTeam } from "@/hooks/use-teams";

const TeamInfoPage = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const { data, isPending } = useTeam(id);

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div>
      <TeamForm defaultValue={data?.name} mode="edit" teamId={id} />
      <Card>
        <Card.Header>
          <Link href={`/${slug}/settings/teams/${id}/members`}>Members</Link>
        </Card.Header>
      </Card>
    </div>
  );
};

export default TeamInfoPage;
