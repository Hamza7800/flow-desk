"use client";

import { useSetOrgActive } from "@/hooks/use-organizations";
import { Card, Spinner } from "@heroui/react";
import { ArrowRight } from "lucide-react";

const avatarColors = [
  "from-blue-500 to-cyan-400",
  "from-violet-500 to-purple-400",
  "from-emerald-500 to-teal-400",
  "from-rose-500 to-pink-400",
  "from-amber-500 to-orange-400",
];

const OrganizationCard = ({
  org,
  index = 0,
}: {
  org: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    logo?: string | null;
    metadata?: any;
    members?: any[];
  };
  index?: number;
}) => {
  const action = useSetOrgActive();
  const isLoading = action.isPending;

  const initials = org.name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      onClick={() => action.mutate({ id: org.id, slug: org.slug })}
      className="group relative flex w-full cursor-pointer flex-row items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-white/[0.03] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {/* Gradient avatar */}
      <div
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${avatarColors[index % avatarColors.length]} text-[13px] font-bold text-white shadow-md`}
      >
        {isLoading ? (
          <Spinner size="sm" />
        ) : org.logo ? (
          <img
            src={org.logo}
            alt={org.name}
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{org.name}</p>
        {/* <div className="mt-0.5 flex items-center gap-2">
          <span className="text-xs text-zinc-600">/{org.slug}</span>
        </div> */}
      </div>

      <ArrowRight
        size={15}
        className="shrink-0 translate-x-1 text-transparent opacity-0 transition-all group-hover:translate-x-0 group-hover:text-zinc-500 group-hover:opacity-100"
      />
    </Card>
  );
};

export default OrganizationCard;
