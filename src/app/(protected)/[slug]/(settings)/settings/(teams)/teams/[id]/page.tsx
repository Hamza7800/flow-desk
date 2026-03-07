"use client";
import { Card } from "@heroui/react";
import Link from "next/link";
import { useParams } from "next/navigation";

const TeamInfoPage = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  return (
    <div>
      <Card>
        <Card.Header>
          <Link href={`/${slug}/settings/teams/${id}/members`}>Members</Link>
        </Card.Header>
      </Card>
    </div>
  );
};

export default TeamInfoPage;
