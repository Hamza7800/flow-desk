"use client";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import OrganizationForm from "@/components/forms/organization-form";
import { LoadingState } from "@/components/loading-state";
import { useOrganization } from "@/hooks/use-organizations";
import { Card } from "@heroui/react";
import { Box } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const Form = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const {
    data: organization,
    isPending,
    isError,
    refetch,
    error,
  } = useOrganization(slug);

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load organization"
        message={error?.message}
        onRetry={() => refetch()}
        homeHref={`/${slug}`}
      />
    );
  }

  if (!isPending && !organization) {
    return (
      <EmptyState
        icon={Box}
        title="No Organization"
        description="You don't have any organization right now."
        action={{
          label: "Home",
          onClick: () => router.push(`/${slug}/`),
        }}
      />
    );
  }

  return (
    <Card>
      <OrganizationForm
        mode="edit"
        initialData={organization!}
        organizationId={organization?.id}
      />
    </Card>
  );
};

export default Form;
