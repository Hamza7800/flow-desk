import { CheckCircle2, LayoutGrid, Users, Zap } from "lucide-react";
import { Card } from "@heroui/react";
import { LinkButton } from "@/components/link-button";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <nav className="sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* <div className="text-xl font-bold text-white"> */}
          <Link href="/">
            <Image width={120} height={120} alt="logo" src={"/flow-logo.png"} />
            <span className="sr-only">Flow Desk</span>
          </Link>
          {/* </div> */}
          <div className="flex items-center gap-4">
            <LinkButton variant="ghost" href="/sign-in">
              Sign In
            </LinkButton>
            <LinkButton variant="danger" href="/sign-up">
              Get Started
            </LinkButton>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
        <div className="space-y-8 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Manage Projects Like a
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              Pro
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            A lightweight project management tool built for teams. Track issues,
            organize projects, and collaborate seamlessly with your team.
          </p>
          <div className="mx-auto flex flex-col justify-center gap-4 pt-8 sm:flex-row md:max-w-sm">
            <LinkButton fullWidth variant="danger" size="lg" href="/sign-in">
              Get Started
            </LinkButton>
            <LinkButton fullWidth variant="outline" href="/sign-in">
              Sign In
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-16 text-center text-3xl font-bold text-white">
          Powerful Features
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <Card className="p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
              <LayoutGrid className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Organize Projects
            </h3>
            <p className="text-slate-400">
              Create and manage multiple projects with customizable workflows
              and issue tracking.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Team Collaboration
            </h3>
            <p className="text-slate-400">
              Invite team members, assign tasks, and track progress
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
              <Zap className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Fast & Responsive
            </h3>
            <p className="text-slate-400">
              Lightning-fast performance with a clean, intuitive interface
              designed for productivity.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
