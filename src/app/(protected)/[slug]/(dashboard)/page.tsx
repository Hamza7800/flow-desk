import { LinkButton } from "@/components/link-button";

import { getOrganization } from "@/server-actions/organization";
import { Button, Card, Surface } from "@heroui/react";
import { BarChart3, Plus, Users } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  try {
    const { slug } = await params;
    const result = await getOrganization(slug);

    if (!result.success) {
      throw Error(result.error);
    }

    if (!result.organization) {
      throw new Error("Organization not found");
    }

    const { organization } = result;

    return (
      <div className="min-h-screen">
        <div className="flex">
          <main className="flex-1">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {organization.name}
                </h1>
                <p className="mt-2 text-slate-400">
                  Workspace / {organization.slug}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-slate-600 text-white"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Members
                </Button>
                <Button className="">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="mb-12 grid gap-6 md:grid-cols-3">
              <Card className="">
                <Card.Header className="pb-3">
                  <Card.Title className="text-sm font-medium text-slate-400">
                    Projects
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-3xl font-bold text-white">0</div>
                  <p className="mt-1 text-xs text-slate-400">
                    Create your first project
                  </p>
                </Card.Content>
              </Card>

              <Card className="">
                <Card.Header className="pb-3">
                  <Card.Title className="text-sm font-medium text-slate-400">
                    Team Members
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-3xl font-bold text-white">1</div>
                  <p className="mt-1 text-xs text-slate-400">
                    You are the only member
                  </p>
                </Card.Content>
              </Card>

              <Card className="">
                <Card.Header className="pb-3">
                  <Card.Title className="text-sm font-medium text-slate-400">
                    Issues
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-3xl font-bold text-white">0</div>
                  <p className="mt-1 text-xs text-slate-400">
                    No active issues
                  </p>
                </Card.Content>
              </Card>
            </div>

            {/* Getting Started */}
            <Card className="">
              <Card.Header>
                <Card.Title className="text-white">Get Started</Card.Title>
                <Card.Description className="text-slate-400">
                  Set up your first project to start tracking issues
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Surface variant="secondary" className="rounded-lg p-4">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
                      <BarChart3 className="h-4 w-4 text-blue-400" />
                      Create a Project
                    </h3>
                    <p className="text-sm text-slate-400">
                      Start by creating a new project for your team to manage
                      issues and tasks.
                    </p>
                    <Button className="mt-4 w-full">Create Project</Button>
                  </Surface>

                  <Surface variant="secondary" className="rounded-lg p-4">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
                      <Users className="h-4 w-4 text-purple-400" />
                      Invite Team Members
                    </h3>
                    <p className="text-sm text-slate-400">
                      Add team members to collaborate on projects and tasks. and
                      solve issues
                    </p>
                    <Button className="mt-4 w-full text-white">
                      Invite Members
                    </Button>
                  </Surface>
                </div>
              </Card.Content>
            </Card>
          </main>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="mx-auto flex w-lg items-center justify-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>

          <h2 className="text-xl font-semibold">No Found</h2>

          <p className="text-muted-foreground mt-2 text-sm">{error?.message}</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <LinkButton href="/">Home</LinkButton>
          </div>
        </Card>
      </div>
    );
  }
}
