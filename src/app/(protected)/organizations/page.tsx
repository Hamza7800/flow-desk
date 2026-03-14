import { getUserListOrganizations } from "@/server-actions/organization";
import { auth } from "@/server/better-auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Plus, ChevronLeft } from "lucide-react";
import OrganizationCard from "./_components/org-card";

export default async function UserOrganizations() {
  const result = await getUserListOrganizations();
  const organizations = result.success ? (result.data ?? []) : [];
  const session = await auth.api.getSession({ headers: await headers() });

  const avatarColors = [
    "from-blue-500 to-cyan-400",
    "from-violet-500 to-purple-400",
    "from-emerald-500 to-teal-400",
    "from-rose-500 to-pink-400",
    "from-amber-500 to-orange-400",
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0a0a]">
      {/* ── top bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-8 py-6">
        <div></div>
        {session?.user?.email && (
          <div className="text-right">
            <p className="text-xs text-zinc-600">Logged in as</p>
            <p className="text-sm font-medium text-zinc-300">
              {session.user.email}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-24">
        <h1 className="mb-8 text-center text-[1.4rem] font-semibold text-white">
          You have access to these workspaces
        </h1>

        <div className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-zinc-800/70 bg-[#141414]">
          {organizations.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-zinc-500">
              No workspaces found.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {organizations.map((org, i) => (
                <OrganizationCard key={org.id} org={org} index={i} />
              ))}
            </div>
          )}

          <div className="border-t border-zinc-800/50 px-6 py-4">
            <Link
              href="/onboarding"
              className="flex items-center gap-2.5 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-700 transition-colors hover:border-zinc-500">
                <Plus size={11} />
              </div>
              Create new workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
