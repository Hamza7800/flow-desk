"use client";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { ErrorState } from "@/components/error-state";
import { SiteHeader } from "@/components/site-header";
import { useCurrentMemberRole } from "@/hooks/use-member-role";
import OrgMembers from "../_components/org-members";

const MembersPage = () => {
  const { org } = useOrganizationContext();
  const { data: userRole, isPending } = useCurrentMemberRole();

  if (isPending) {
    return null;
  }

  if (userRole === "member" && !isPending) {
    return (
      <ErrorState
        title="Access Denied"
        message={"You don't have permission to view this page"}
        // onRetry={() => refetch()}
        homeHref={`/${org?.slug}`}
      />
    );
  }

  return (
    <div className="h-screen flex-col overflow-hidden">
      <SiteHeader heading="Members" />

      <OrgMembers />
    </div>
  );
};

export default MembersPage;
