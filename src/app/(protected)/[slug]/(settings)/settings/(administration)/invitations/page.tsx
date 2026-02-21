"use client";
import { useUserInvitations } from "@/hooks/use-invitations";
import { Card, Chip, Surface } from "@heroui/react";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import AcceptInvitation from "@/app/(protected)/[slug]/(settings)/_components/accept-invitation";
import CancelInvitation from "@/app/(protected)/[slug]/(settings)/_components/cancel-invitation";
import { authClient } from "@/server/better-auth/client";
import RejectInvitation from "../../../_components/reject-invitation";

const Page = () => {
  const params = useParams();
  const { data } = authClient.useSession();
  const slug = params.slug as string;
  const { data: invitations, isLoading } = useUserInvitations(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!invitations?.length) {
    return <Card>No Invitations</Card>;
  }

  return (
    <div className="min-h-screen">
      <main className="flex-1">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Invites</h1>
            <p className="mt-2 text-slate-400">
              Manage your team members and their roles
            </p>
          </div>
        </div>

        {/* Invitations */}
        <Card>
          <Card.Header>
            <Card.Title className="text-white">Invitations</Card.Title>
            <Card.Description className="text-slate-400">
              Current invitations sent
            </Card.Description>
          </Card.Header>
          <Card.Content>
            {invitations.map((invite) => (
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
                  {data?.user.id === invite.inviterId ? null : (
                    <RejectInvitation slug={slug} inviteId={invite.id} />
                  )}
                  {data?.user.email === invite.email ? (
                    <AcceptInvitation slug={slug} inviteId={invite.id} />
                  ) : null}
                </div>
              </Surface>
            ))}
          </Card.Content>
        </Card>
      </main>
    </div>
  );
};

export default Page;
