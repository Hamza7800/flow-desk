"use client";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { SiteHeader } from "@/components/site-header";

const MembersPage = () => {
  const { org } = useOrganizationContext();

  return (
    // Force the page to take up the full height of the parent
    <div className="flex h-full flex-col overflow-hidden">
      <SiteHeader heading="Members" />

      {/* flex-1: Takes up all remaining space
          min-h-0: Essential for flex children to allow inner scrolling
          overflow-y-auto: Finally enables the scrollbar
      */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {org?.members.map((member) => (
          <div key={member.id} className="border-b border-zinc-800 py-4">
            <h2 className="text-zinc-200">{member.user.name}</h2>
            <h2 className="text-sm text-zinc-500">{member.role}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersPage;
