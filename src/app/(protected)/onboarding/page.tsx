"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  Surface,
  TextField,
  toast,
} from "@heroui/react";
import { authClient } from "@/server/better-auth/client";
import { Controller, useForm } from "react-hook-form";
import {
  organizationSchema,
  type OrganizationSchemaType,
} from "@/zod-schema/organization-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/context/auth-context";
import { useCreateOrganization } from "@/hooks/use-organizations";

// TODO: MAKE SERVER ACTIONS
export default function OnboardingPage() {
  const router = useRouter();
  // const { logout } = useAuth();
  const action = useCreateOrganization();
  const { data: session } = authClient.useSession();

  const { handleSubmit, control, setValue } = useForm<OrganizationSchemaType>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const generateSlug = (name: string) => {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // const handleNameChange = (value: string) => {
  //   const slug = generateSlug(value);
  //   setValue("name", value);
  //   setValue("slug", slug);
  // };

  // const createOrgAction = async (values: OrganizationSchemaType) => {
  //   await new Promise((res) => setTimeout(res, 5000));
  //   console.log(values);
  //   return {
  //     success: true,
  //   };
  // };

  const onSubmit = async (values: OrganizationSchemaType) => {
    action.mutate(values);

    // toast.promise(createOrgAction(values), {
    //   loading: "Creating Organization...",
    //   success: (data) => {
    //     router.push("/onboarding");
    //     return `Created! ${values.name}`;
    //   },
    //   error: (err) => {
    //     return err.message;
    //   },
    // });
  };

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Surface
      variant="secondary"
      className="flex min-h-screen items-center justify-center px-4"
    >
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold text-white">
            Welcome, {session.user.name}!
          </h1>
          <p className="text-slate-400">Let's set up your first organization</p>
        </div>

        {/* Form Card */}
        <Card className="mx-auto max-w-lg p-8">
          <Form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="text-2xl font-bold text-white">
              Create Your Organization
            </h2>

            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);
                    setValue("slug", generateSlug(value), {
                      shouldValidate: true,
                    });
                  }}
                  isInvalid={fieldState.invalid}
                >
                  <Label>Name</Label>
                  <Input variant="secondary" placeholder="Space" />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />

            <Controller
              control={control}
              name="slug"
              render={({ field, fieldState }) => (
                <TextField {...field} isInvalid={fieldState.invalid}>
                  <Label>Slug</Label>
                  <Input variant="secondary" placeholder="Slug" />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />

            <Button
              isPending={action.isPending}
              type="submit"
              className="w-full"
            >
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : null}
                  Create <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </Form>
        </Card>
      </div>
    </Surface>
  );
}
