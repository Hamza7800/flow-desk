"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, Chip, Surface } from "@heroui/react";
import { useOrganization } from "@/hooks/use-organizations";
import InviteMembers from "@/app/(protected)/[slug]/(settings)/_components/invite-members";
import CancelInvitation from "@/app/(protected)/[slug]/(settings)/_components/cancel-invitation";
import { authClient } from "@/server/better-auth/client";

export default function MembersPage() {
  const params = useParams();
  const { data } = authClient.useSession();

  const slug = params.slug as string;
  const { data: organization, isLoading } = useOrganization(slug);

  if (isLoading || !organization) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="flex-1">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Team Members</h1>
            <p className="mt-2 text-slate-400">
              Manage your team members and their roles
            </p>
          </div>
          <InviteMembers slug={slug} orgId={organization.id} />
        </div>

        {/* Members List */}
        <Card className="mb-4">
          <Card.Header>
            <Card.Title className="text-white">Organization Members</Card.Title>
            <Card.Description className="text-slate-400">
              Current members and their roles in {organization.name}
            </Card.Description>
          </Card.Header>
          <Card.Content>
            {organization.members.map((member) => (
              <Surface
                variant="secondary"
                key={member.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                    {member?.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {member?.user.name}
                    </p>
                    <p className="text-sm text-slate-400">
                      {member?.user.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Chip variant="secondary" color="success">
                    {member?.role}
                  </Chip>
                </div>
              </Surface>
            ))}
          </Card.Content>
        </Card>
        {/* Invitations */}
        <Card>
          <Card.Header>
            <Card.Title className="text-white">Invitations</Card.Title>
            <Card.Description className="text-slate-400">
              Current invitations sent
            </Card.Description>
          </Card.Header>
          <Card.Content>
            {organization.invitations.map((invite) => (
              <Surface
                variant="secondary"
                key={invite.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                    {invite?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-white">{invite?.email}</p>
                    {/* <p className="text-sm text-slate-400">
                      {invite?.user.email}
                    </p> */}
                  </div>
                </div>
                <div className="space-x-2 text-right">
                  <Chip variant="secondary" color="warning">
                    {invite.role}
                  </Chip>
                  <Chip variant="secondary" color="success">
                    {invite.status}
                  </Chip>
                </div>
                <div className="space-x-2">
                  {data?.user.id === invite.inviterId ? (
                    <CancelInvitation slug={slug} inviteId={invite.id} />
                  ) : null}
                </div>
              </Surface>
            ))}
          </Card.Content>
        </Card>
      </main>
    </div>
  );
}
