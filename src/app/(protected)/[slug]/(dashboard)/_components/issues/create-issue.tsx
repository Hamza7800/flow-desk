"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { issueSchema, type IssueSchemaType } from "@/zod-schema/issue-schema";
import { useCreateIssue } from "@/hooks/use-issues";

import type { Selection } from "@heroui/react";

import {
  Modal,
  Button,
  Input,
  TextArea,
  Form,
  TextField,
  Label,
  FieldError,
  Dropdown,
  Spinner,
  Header,
} from "@heroui/react";

import { useState } from "react";
import PopupModal from "@/components/modal";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import StatusSelect from "../input-fields/status-select";
import PrioritySelect from "../input-fields/priority-select";
import AssigneeSelect from "../input-fields/assignee-select";
import InlineInput from "../input-fields/input";

type Props = {
  teamId: string;
};

// TODO: ADD LABELS and PROJECTS
// TODO NEED TO FIX UI AND COMPONENTS
export function CreateIssueModal({ teamId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { org: organization } = useOrganizationContext();
  const { mutate, isPending } = useCreateIssue(organization?.id ?? "", teamId);

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
    setValue,
  } = useForm<IssueSchemaType>({
    resolver: zodResolver(issueSchema),
    mode: "onChange",
    defaultValues: {
      status: "backlog",
      priority: "no-priority",
      assigneeIds: [],
      labelIds: [],
    },
  });

  const onSubmit = (data: IssueSchemaType) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        setIsOpen(false);
      },
    });
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      heading="Create Issue"
      triggerText="Create Issue"
    >
      <Form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        {/* TITLE */}
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <InlineInput
              initialValue={field.value}
              onSave={(val) => field.onChange(val)}
              schema={issueSchema.shape.title}
              debounceMs={0}
              placeholder="Issue title"
            />
          )}
        />

        {/* DESCRIPTION */}
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <InlineInput
              initialValue={field.value ?? ""}
              onSave={(val) => field.onChange(val)}
              schema={issueSchema.shape.description}
              debounceMs={0}
              placeholder="Issue Description"
            />
          )}
        />

        {/* STATUS DROPDOWN */}
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <StatusSelect value={field.value} onChange={field.onChange} />
          )}
        />

        {/* PRIORITY DROPDOWN */}
        <Controller
          control={control}
          name="priority"
          render={({ field }) => (
            <PrioritySelect value={field.value} onChange={field.onChange} />
          )}
        />
        <Controller
          control={control}
          name="assigneeIds"
          render={({ field }) => (
            <AssigneeSelect
              label="Assignee"
              value={field.value || []}
              onChange={field.onChange}
            />
          )}
        />
        <Button
          type="submit"
          variant="secondary"
          isPending={isPending}
          isDisabled={!isValid}
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
