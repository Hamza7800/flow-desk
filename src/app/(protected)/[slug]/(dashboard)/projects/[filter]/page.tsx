"use client";

import { format } from "date-fns";
import { Lock, Archive, Calendar, Layers } from "lucide-react";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { useOrgProject } from "@/hooks/use-projects";
import { Spinner } from "@heroui/react";

// TODO: NEED TO PASS DATA AS INITIAL DATA TO REACT QUERY;

const OrganizationProjects = () => {
  const { org } = useOrganizationContext();
  const {
    data: projects,
    isPending,
    isError,
    error,
  } = useOrgProject(org?.id ?? "");

  if (!projects?.length) {
    return <h2>No projects</h2>;
  }

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <div className="p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default OrganizationProjects;
function ProjectCard({ project }: { project: any }) {
  const isArchived = !!project.archivedAt;

  console.log(project);
  const lead = project.members.find((m: any) => m.user.id === project.leadId);
  console.log(lead);
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900 ${
        isArchived ? "opacity-60" : ""
      }`}
    >
      {/* Color Accent */}
      <div
        className="absolute top-0 left-0 h-full w-1"
        style={{ backgroundColor: project.color || "#52525b" }}
      />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-semibold"
            style={{
              backgroundColor: project.color ? `${project.color}20` : "#27272a",
              color: project.color || "#a1a1aa",
            }}
          >
            {project.icon || project.identifier.slice(0, 2)}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{project.name}</h3>
            <span className="text-xs text-zinc-500">{project.identifier}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2">
          {project.isPrivate && <Lock size={14} className="text-zinc-500" />}

          {isArchived && <Archive size={14} className="text-zinc-500" />}
        </div>
      </div>

      {/* Summary */}
      {project.summary && (
        <p className="mb-4 line-clamp-2 text-xs text-zinc-400">
          {project.summary}
        </p>
      )}

      {/* Metadata */}
      <div className="flex flex-col gap-3 text-xs text-zinc-500">
        {/* Issue Count */}
        <div className="flex items-center gap-2">
          <Layers size={14} />
          <span>{project.issueCounter ?? 0} issues</span>
        </div>

        {/* Date Range */}
        {(project.startDate || project.endDate) && (
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>
              {project.startDate
                ? format(new Date(project.startDate), "MMM d")
                : "—"}
              {"  "}–{"  "}
              {project.endDate
                ? format(new Date(project.endDate), "MMM d")
                : "—"}
            </span>
          </div>
        )}

        {/* Team */}
        {project.team && (
          <div className="text-xs text-zinc-600">Team: {project.team.name}</div>
        )}
        {/* TODO: GET USER EMAIL */}
        {lead && (
          <div className="text-xs text-zinc-600">Lead: {lead.user.name}</div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent transition group-hover:ring-zinc-700" />
    </div>
  );
}
