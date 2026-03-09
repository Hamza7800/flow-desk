import type { IssueType } from "@/server-actions/issues";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  CircleDot,
  UserPlus,
  AlertCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import { useOrganizationContext } from "@/components/context/organization-client-context";

type SingleActivity = NonNullable<IssueType["data"]>["activities"][number];
export const IssueActivities = ({
  activities,
}: {
  activities: NonNullable<IssueType["data"]>["activities"];
}) => {
  const { org } = useOrganizationContext();

  const resolveUserNames = (idsString: string | null | undefined) => {
    if (!idsString) return "";

    return idsString
      .split(",")
      .map((id) => {
        const member = org?.members.find((m) => m.userId === id.trim());
        return member?.user.name || "Unknown User";
      })
      .join(", ");
  };

  return (
    <div className="flex flex-col gap-y-4 py-4">
      {activities.map((activity, index) => {
        const actor = org?.members.find((m) => m.userId === activity.actorId);

        return (
          <div key={activity.id} className="relative flex gap-x-3">
            {/* Timeline line */}
            {index !== activities.length - 1 && (
              <div className="absolute top-7 left-[11px] h-full w-[1px] bg-zinc-800" />
            )}

            <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 shadow-sm">
              <ActivityIcon type={activity.type as SingleActivity["type"]} />
            </div>

            <div className="flex flex-1 flex-col gap-y-1">
              <div className="flex items-center gap-x-2 text-xs">
                <span className="font-medium text-zinc-200">
                  {actor?.user.name || "System"}
                </span>

                <span className="text-zinc-500">
                  {activity.type === "assignee_change" ? (
                    <>
                      {activity.newValue
                        ? `assigned this to `
                        : `removed all assignees`}
                      <span className="font-medium text-zinc-300">
                        {resolveUserNames(activity.newValue)}
                      </span>
                    </>
                  ) : (
                    renderDescription(activity as SingleActivity)
                  )}
                </span>

                <span className="ml-auto flex items-center gap-1 text-xs text-zinc-600">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {/* Only show the diff chips for non-assignee changes (Status, Priority, etc) */}
              {activity.type !== "assignee_change" &&
                (activity.oldValue || activity.newValue) && (
                  <div className="flex items-center gap-x-2 text-xs">
                    {activity.oldValue && (
                      <span className="rounded bg-zinc-800/50 px-1.5 py-0.5 text-zinc-400 line-through decoration-zinc-600">
                        {activity.oldValue}
                      </span>
                    )}
                    {activity.oldValue && activity.newValue && (
                      <ArrowRight className="h-3 w-3 text-zinc-600" />
                    )}
                    {activity.newValue && (
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-medium tracking-tight text-zinc-200 uppercase">
                        {activity.newValue}
                      </span>
                    )}
                  </div>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 4. Helper types fixed by using SingleActivity["type"]
const ActivityIcon = ({ type }: { type: SingleActivity["type"] }) => {
  switch (type) {
    case "status_change":
      return <CircleDot className="h-3 w-3 text-blue-400" />;
    case "priority_change":
      return <AlertCircle className="h-3 w-3 text-orange-400" />;
    case "assignee_change":
      return <UserPlus className="h-3 w-3 text-purple-400" />;
    case "comment_added":
      return <MessageSquare className="h-3 w-3 text-green-400" />;
    default:
      return <CircleDot className="h-3 w-3 text-zinc-500" />;
  }
};

const renderDescription = (activity: SingleActivity) => {
  switch (activity.type) {
    case "status_change":
      return "changed status";
    case "priority_change":
      return "updated priority";
    case "comment_added":
      return "commented";
    case "assignee_change":
      return activity.newValue ? "assigned the issue" : "unassigned the issue";
    default:
      return "updated this issue";
  }
};
