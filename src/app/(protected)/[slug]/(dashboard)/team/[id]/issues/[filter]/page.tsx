"use client";

import { useState } from "react";
import { CreateIssueModal } from "@/components/create-issue";
import { useOrgTeams } from "@/hooks/use-teams";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { useParams } from "next/navigation";

// TODO: FIX UI AND QUERY FUNCTIONS
export default function Page() {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const { org } = useOrganizationContext();
  const { data } = useOrgTeams(org?.id ?? "");

  const team = data?.data?.find((t) => t.id === id);
  if (!team) {
    return <h2>No team</h2>;
  }

  return (
    <>
      <CreateIssueModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        orgId={team.organizationId}
        teamId={team.id}
      />
    </>
  );
}
