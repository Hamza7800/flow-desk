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
import { LoadingState } from "../loading-state";
import { cn } from "@/lib/utils";

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
    return <LoadingState />;
  }

  const isPending = updateMutation.isPending || createMutation.isPending;

  return (
    <div className="w-full">
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
              {mode === "edit" && <Label>Name</Label>}
              <Input
                variant="secondary"
                className={cn(mode === "create" && "w-full")}
                placeholder="Space"
              />
              {/* <FieldError>{fieldState.error?.message}</FieldError> */}
              <FieldError className={"absolute right-0 -bottom-5"}>
                {fieldState.error?.message}
              </FieldError>
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="slug"
          render={({ field, fieldState }) => (
            <TextField
              className={"relative flex-row items-center justify-between"}
              {...field}
              isInvalid={fieldState.invalid}
            >
              {mode === "edit" && <Label>Slug</Label>}
              <Input
                className={cn(mode === "create" && "w-full")}
                variant="secondary"
                placeholder="Slug"
              />
              <FieldError className={"absolute right-0 -bottom-5"}>
                {fieldState.error?.message}
              </FieldError>
            </TextField>
          )}
        />
        <Button
          isPending={isPending}
          variant="outline"
          type="submit"
          className="-mt-2 ml-auto"
        >
          {({ isPending }) => (
            <>
              {isPending ? <Spinner color="current" size="sm" /> : null}
              {mode === "create" ? "Create" : "Update"}{" "}
            </>
          )}
        </Button>
      </Form>
    </div>
  );
};

export default OrganizationForm;
