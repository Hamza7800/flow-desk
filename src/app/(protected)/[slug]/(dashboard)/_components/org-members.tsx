"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Users,
  Crown,
  Shield,
  User,
  Mail,
  MoreHorizontal,
  UserPlus,
} from "lucide-react";
import { Button, Card, Chip, Separator, Surface } from "@heroui/react";
import { useOrganization } from "@/hooks/use-organizations";
import InviteMembers from "@/app/(protected)/[slug]/(settings)/_components/invite-members";
import CancelInvitation from "@/app/(protected)/[slug]/(dashboard)/_components/invitations/cancel-invitation";
import { authClient } from "@/server/better-auth/client";
import { useState } from "react";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { RemoveMemberFromOrg } from "@/app/(protected)/[slug]/(dashboard)/_components/teams/remove-member-from-org";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import PermissionGate from "@/components/permission-gate";
import { Avatar } from "@/components/avatar";
import { useAuth } from "@/components/context/auth-context";
import RoleSelect from "./input-fields/role-select";

const roleIcon = (role: string) => {
  switch (role) {
    case "owner":
      return <Crown size={11} />;
    case "admin":
      return <Shield size={11} />;
    default:
      return <User size={11} />;
  }
};

const roleColor = (role: string) => {
  switch (role) {
    case "owner":
      return "warning";
    case "admin":
      return "accent";
    default:
      return "default";
  }
};

const statusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "accepted":
      return "success";
    case "rejected":
      return "danger";
    default:
      return "default";
  }
};

export default function OrgMembers() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { org } = useOrganizationContext();
  const { user } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const {
    data: organization,
    isPending,
    isError,
    error,
    refetch,
  } = useOrganization(slug);

  if (isPending) return <LoadingState />;

  if (isError)
    return (
      <ErrorState
        title="Failed to load organization"
        message={error?.message}
        onRetry={() => refetch()}
        homeHref={`/${slug}`}
      />
    );

  if (!organization)
    return (
      <EmptyState
        icon={Users}
        title="No Members found"
        description="You don't have any members right now."
        action={{ label: "Home", onClick: () => router.push(`/${slug}/`) }}
      />
    );

  const currentMember = organization.members.find((m) => m.userId === user?.id);
  const canManageInvites =
    currentMember?.role === "admin" || currentMember?.role === "owner";

  const pendingInvites = organization.invitations.filter(
    (i) => i.status === "pending",
  );

  const rejectedInvites = organization.invitations.filter(
    (i) => i.status === "rejected",
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <main className="scrollbar-thin min-h-0 flex-1 overflow-y-auto pb-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-white">Members</h1>
              <p className="text-xs text-zinc-500">
                {organization.members.length} member
                {organization.members.length !== 1 ? "s" : ""} in{" "}
                {organization.name}
              </p>
            </div>
            <PermissionGate permission="canInviteMembers">
              <Button
                variant="outline"
                size="sm"
                onPress={() => setIsInviteModalOpen(true)}
              >
                <UserPlus size={14} className="mr-1" />
                Invite
              </Button>
            </PermissionGate>
          </div>
        </div>

        <div className="space-y-6 px-2">
          <Card className="p-0" variant="transparent">
            <Card.Content>
              <div>
                {organization.members.map((member) => (
                  <div
                    key={member.id}
                    className="group grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-zinc-800/30"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar
                        name={member.user.name}
                        email={member.user.email}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {member.user.name}
                          {member.userId === user?.id && (
                            <span className="ml-1.5 text-[10px] font-normal text-zinc-500">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="flex items-center gap-1 truncate text-xs text-zinc-500">
                          <Mail size={10} />
                          {member.user.email}
                        </p>
                      </div>
                    </div>

                    <Chip
                      variant="secondary"
                      color={roleColor(member.role) as any}
                      size="sm"
                      className="gap-1 text-xs"
                    >
                      {roleIcon(member.role)}
                      {member.role}
                    </Chip>

                    <div className="ml-auto flex w-fit items-center gap-2">
                      <PermissionGate permission="isOwner">
                        <RoleSelect
                          memberId={member.id}
                          currentRole={member.role}
                          memberUserId={member.userId}
                        />
                      </PermissionGate>
                      {/* <PermissionGate permission={"canInviteMembers"}>
                        <div className="ml-auto">
                          <RemoveMemberFromOrg
                            isCurrentUser={member.userId === user?.id}
                            userId={member.id}
                          />
                        </div>
                      </PermissionGate> */}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {organization.invitations.length > 0 && (
            <Invites
              heading="Pending"
              invites={pendingInvites}
              canManageInvites={canManageInvites}
              slug={slug}
            />
          )}

          {organization.invitations.length > 0 && (
            <Invites
              heading="Rejected"
              invites={rejectedInvites}
              canManageInvites={canManageInvites}
              slug={slug}
            />
          )}
        </div>
      </main>

      <InviteMembers
        isOpen={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        orgId={org?.id ?? ""}
        slug={slug ?? ""}
        setOpen={setIsInviteModalOpen}
        heading="Invite Members to your workspace"
      />
    </div>
  );
}

const Invites = ({
  invites,
  slug,
  canManageInvites,
  heading,
}: {
  invites: any;
  slug: string;
  canManageInvites: boolean;
  heading: string;
}) => {
  return (
    <Card className="p-0" variant="transparent">
      <Card.Header className="px-3">{heading} invites</Card.Header>
      <Card.Content className="">
        <div className="divide-y">
          {invites.map((invite: any) => {
            const showCancel = canManageInvites && invite.status === "pending";
            return (
              <div
                key={invite.id}
                className="group grid grid-cols-[1fr_auto_auto_1fr] items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-zinc-800/30"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-dashed border-zinc-700 text-zinc-500">
                    <Mail size={14} />
                  </div>
                  <p className="truncate text-sm text-zinc-300">
                    {invite.email}
                  </p>
                </div>

                <Chip
                  variant="secondary"
                  color={roleColor(invite.role) as any}
                  size="sm"
                  className="gap-1 text-xs"
                >
                  {roleIcon(invite.role)}
                  {invite.role}
                </Chip>

                <Chip
                  variant="secondary"
                  color={statusColor(invite.status) as any}
                  size="sm"
                  className="text-xs"
                >
                  {invite.status}
                </Chip>
                <div className="ml-auto">
                  {showCancel && (
                    <CancelInvitation slug={slug} inviteId={invite.id} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
};
