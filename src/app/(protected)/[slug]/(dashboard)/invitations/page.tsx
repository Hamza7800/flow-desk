"use client";
import { useUserInvitations } from "@/hooks/use-invitations";
import { Card, Chip, Spinner, Surface } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import AcceptInvitation from "@/app/(protected)/[slug]/(dashboard)/_components/invitations/accept-invitation";
import RejectInvitation from "@/app/(protected)/[slug]/(dashboard)/_components/invitations/reject-invitation";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { Mail, MailCheckIcon, Mails } from "lucide-react";

const Avatar = ({ name, email }: { name?: string; email?: string }) => {
  const letter = (name?.[0] || email?.[0] || "?").toUpperCase();
  const colors = [
    "bg-violet-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-rose-600",
    "bg-amber-600",
    "bg-cyan-600",
  ];
  const color = colors[(letter.charCodeAt(0) ?? 0) % colors.length];
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${color} text-sm font-semibold text-white`}
    >
      {letter}
    </div>
  );
};

const Page = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: invitations,
    isPending,
    isError,
    error,
    refetch,
  } = useUserInvitations(slug);
  const router = useRouter();

  if (isPending) {
    return <LoadingState label="Loading Invitations" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load invitations"
        message={error?.message}
        onRetry={() => refetch()}
        homeHref={`/${slug}`}
      />
    );
  }

  if (!isPending && !invitations?.length) {
    return (
      <EmptyState
        icon={MailCheckIcon}
        title="No Invitations"
        description="You don't have any invitations right now."
        action={{
          label: "Home",
          onClick: () => router.push(`/${slug}/`),
        }}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-white">Invitations</h1>
            <p className="text-xs text-zinc-500">
              {invitations?.length} invite
              {invitations?.length !== 1 ? "s" : ""}
              {/* {invitations?.name} */}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-2">
        <Card className="p-0">
          <Card.Header className="p-4 pb-0">
            <div className="flex items-center gap-2">
              <Mails size={15} className="text-zinc-400" />
              <Card.Title className="text-sm font-medium text-white">
                Invitations
              </Card.Title>
              <Chip variant="secondary" size="sm" className="ml-auto text-xs">
                {invitations?.length}
              </Chip>
            </div>
          </Card.Header>

          <Card.Content className="pt-3">
            <div className="mb-2 grid grid-cols-[1fr_auto_1fr] gap-4 px-3 text-[11px] font-medium tracking-wider text-zinc-600 uppercase">
              <span>Member</span>
              <span>Role</span>
              <span></span>
            </div>

            <div>
              {invitations?.map((invite) => (
                <div
                  key={invite.id}
                  className="group grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-zinc-800/30"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={""} email={invite.email} />
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 truncate text-xs text-zinc-500">
                        <Mail size={10} />
                        {invite.email}
                      </p>
                    </div>
                  </div>

                  <Chip
                    variant="secondary"
                    // color={roleColor(member.role) as any}
                    size="sm"
                    className="gap-1 text-xs"
                  >
                    {/* {roleIcon(member.role)} */}
                    {invite.role}
                  </Chip>

                  <div className="ml-auto">
                    <div className="flex space-x-2">
                      <RejectInvitation slug={slug} inviteId={invite.id} />
                      <AcceptInvitation slug={slug} inviteId={invite.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Page;
