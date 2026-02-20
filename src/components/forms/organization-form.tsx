"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  Separator,
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
import {
  useCreateOrganization,
  useUpdateOrganization,
} from "@/hooks/use-organizations";

type Props = {
  mode: "edit" | "create";
  initialData?: Partial<OrganizationSchemaType>;
  organizationId?: string;
};

const OrganizationForm = ({ mode, initialData, organizationId }: Props) => {
  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();
  const { data: session } = authClient.useSession();

  const { handleSubmit, control, setValue, reset } =
    useForm<OrganizationSchemaType>({
      resolver: zodResolver(organizationSchema),
      defaultValues: initialData || {
        name: "",
        slug: "",
      },
    });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData]);

  const generateSlug = (name: string) => {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const onSubmit = async (values: OrganizationSchemaType) => {
    if (mode === "create") {
      createMutation.mutate(values);
    } else {
      updateMutation.mutate({ id: organizationId!, values });
    }
  };

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const isPending = updateMutation.isPending || createMutation.isPending;

  return (
    // <Surface
    //   variant="secondary"
    //   className="flex min-h-screen items-center justify-center px-4"
    // >
    <div className="w-full space-y-8">
      {/* <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold text-white">
            Welcome, {session.user.name}!
          </h1>
          <p className="text-slate-400">Let's set up your first organization</p>
        </div> */}

      <Form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              onChange={(value) => {
                field.onChange(value);
                if (mode === "create") {
                  setValue("slug", generateSlug(value), {
                    shouldValidate: true,
                  });
                }
              }}
              isInvalid={fieldState.invalid}
              className={"relative flex-row items-center justify-between"}
            >
              <Label>Name</Label>
              <Input
                variant="secondary"
                className={"w-full max-w-xs"}
                placeholder="Space"
              />
              {/* <FieldError>{fieldState.error?.message}</FieldError> */}
              <FieldError className={"absolute right-0 -bottom-5"}>
                {fieldState.error?.message}
              </FieldError>
            </TextField>
          )}
        />
        <Separator />
        <Controller
          control={control}
          name="slug"
          render={({ field, fieldState }) => (
            <TextField
              className={"relative flex-row items-center justify-between"}
              {...field}
              isInvalid={fieldState.invalid}
            >
              <Label>Slug</Label>
              <Input
                className={"w-full max-w-xs"}
                variant="secondary"
                placeholder="Slug"
              />
              <FieldError className={"absolute right-0 -bottom-5"}>
                {fieldState.error?.message}
              </FieldError>
            </TextField>
          )}
        />
        <Separator />

        <Button
          isPending={isPending}
          variant="secondary"
          type="submit"
          className="-mt-4 ml-auto"
        >
          {({ isPending }) => (
            <>
              {isPending ? <Spinner color="current" size="sm" /> : null}
              {mode === "create" ? "Create" : "Update"}{" "}
              {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
            </>
          )}
        </Button>
      </Form>
    </div>
  );
};

export default OrganizationForm;
