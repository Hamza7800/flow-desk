"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { issueSchema, type IssueSchemaType } from "@/zod-schema/issue-schema";
import { useCreateIssue } from "@/hooks/use-issues";

import { Button, Form, Spinner } from "@heroui/react";

import { useEffect, useState } from "react";
import PopupModal from "@/components/modal";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import StatusSelect from "../input-fields/status-select";
import PrioritySelect from "../input-fields/priority-select";
import AssigneeSelect from "../input-fields/assignee-select";
import InlineInput from "../input-fields/input";
import ProjectSelect from "../input-fields/project-select";
import InlineBlockNote from "../input-fields/block-note-input";

type Props = {
  teamId: string;
  defaultValues?: Partial<IssueSchemaType>;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

// TODO: ADD LABELS and PROJECTS
// TODO NEED TO FIX UI AND COMPONENTS
export function CreateIssueModal({
  teamId,
  isOpen,
  onOpenChange,
  defaultValues,
}: Props) {
  const { org: organization } = useOrganizationContext();
  const { mutate, isPending } = useCreateIssue(organization?.id ?? "", teamId);

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
    reset,
  } = useForm<IssueSchemaType>({
    resolver: zodResolver(issueSchema),
    mode: "onChange",
    defaultValues: {
      status: "backlog",
      priority: "low",
      projectId: "",
      assigneeIds: [],
      labelIds: [],
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues]);

  const onSubmit = (data: IssueSchemaType) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      heading="Create Issue"
    >
      <Form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <InlineInput
              initialValue={field.value}
              onSave={(val) => field.onChange(val.trim())}
              schema={issueSchema.shape.title}
              debounceMs={0}
              placeholder="Issue title"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <InlineBlockNote
              initialValue={field.value ?? ""}
              onSave={(val) => field.onChange(val)}
              schema={issueSchema.shape.description}
              debounceMs={0}
              placeholder="Issue Description"
            />
          )}
        />

        <div className="mt-2 flex">
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <StatusSelect
                mode="create"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <PrioritySelect
                mode="create"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="assigneeIds"
            render={({ field }) => (
              <AssigneeSelect
                mode="create"
                value={field.value || []}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="projectId"
            render={({ field }) => (
              <ProjectSelect
                mode="create"
                orgId={organization?.id ?? ""}
                teamId={teamId}
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          isPending={isPending}
          isDisabled={!isValid || !!errors.title?.message}
          className="ml-auto"
        >
          {({ isPending }) => (
            <>
              {isPending ? <Spinner color="current" size="sm" /> : null}
              Create Issue
            </>
          )}
        </Button>
      </Form>
    </PopupModal>
  );
}
