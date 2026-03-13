"use client";

import { useOrganizationContext } from "@/components/context/organization-client-context";
import { useCreateTeam, useUpdateTeam } from "@/hooks/use-teams";
import { teamSchema, type TeamSchemaType } from "@/zod-schema/teams-schema";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  TextField,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const TeamForm = ({
  mode,
  teamId,
  defaultValue,
}: {
  teamId?: string;
  mode: "edit" | "create";
  defaultValue?: string;
}) => {
  const { org } = useOrganizationContext();
  const createMutation = useCreateTeam(org?.id ?? "");
  const updateMutation = useUpdateTeam(org?.id ?? "");

  const { handleSubmit, control, reset } = useForm<TeamSchemaType>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (defaultValue) {
      reset({ name: defaultValue });
    }
  }, [defaultValue]);

  const onSubmit = async (values: TeamSchemaType) => {
    if (mode === "edit" && teamId) {
      updateMutation.mutate({ teamId, values });
      return;
    }
    createMutation.mutate(values);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="w-full space-y-8">
      <Form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              isInvalid={fieldState.invalid}
              className={"relative flex-row items-center justify-between"}
            >
              <Label>Name</Label>
              <Input
                variant="secondary"
                className={"w-full max-w-xs"}
                placeholder="Team"
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
          className="ml-auto"
        >
          {({ isPending }) => (
            <>
              {isPending ? <Spinner color="current" size="sm" /> : null}
              {mode === "create" ? " Create" : "Update"}
            </>
          )}
        </Button>
      </Form>
    </div>
  );
};

export default TeamForm;
