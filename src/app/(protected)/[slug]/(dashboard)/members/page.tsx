"use client";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { SiteHeader } from "@/components/site-header";

const MembersPage = () => {
  const { org } = useOrganizationContext();

  return (
    <div className="">
      <SiteHeader heading="Members" />
      {/* <div className="scrollbar-thin h-screen overflow-x-auto">
        <pre>{JSON.stringify(org, null, 2)}</pre>
      </div> */}
      {org?.members.map((member) => (
        <div key={member.id}>
          <h2>{member.user.name}</h2>
          <h2>{member.role}</h2>
        </div>
      ))}
    </div>
  );
};

export default MembersPage;
