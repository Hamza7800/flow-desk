import OrganizationForm from "@/components/forms/organization-form";
import { Card } from "@heroui/react";

const Content = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0c0c0e] px-4">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div>
            <h1 className="text-3xl font-semibold text-white">
              Create new workspace
            </h1>
          </div>
        </div>

        <Card className="p-6">
          <Card.Content>
            <OrganizationForm mode="create" />
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default async function OnboardingPage() {
  return <Content />;
}
