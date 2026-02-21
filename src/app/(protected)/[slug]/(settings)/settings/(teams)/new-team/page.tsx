"use client";

import { useOrganizationContext } from "@/components/context/organization-client-context";
import { useCreateTeam } from "@/hooks/use-teams";
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
import { Controller, useForm } from "react-hook-form";

const CreateTeam = () => {
  const { org } = useOrganizationContext();
  const createMutation = useCreateTeam(org?.id ?? "");

  const { handleSubmit, control, setValue, reset } = useForm<TeamSchemaType>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: TeamSchemaType) => {
    createMutation.mutate(values);
  };

  const isPending = createMutation.isPending;

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
          variant="secondary"
          type="submit"
          className="ml-auto"
        >
          {({ isPending }) => (
            <>
              {isPending ? <Spinner color="current" size="sm" /> : null}
              Create
            </>
          )}
        </Button>
      </Form>
    </div>
  );
};

export default CreateTeam;
