"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectSchema,
  type ProjectSchemaType,
} from "@/zod-schema/project-schema";
import { Button, Form, Spinner } from "@heroui/react";
import { useState } from "react";
import PopupModal from "@/components/modal";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { useCreateProject } from "@/hooks/use-projects";
import StatusSelect from "../input-fields/status-select";
import PrioritySelect from "../input-fields/priority-select";
import AssigneeSelect from "../input-fields/assignee-select";
import InlineInput from "../input-fields/input";
import InlineBlockNote from "../input-fields/block-note-input";
import DateSelect from "../input-fields/date-picker";

type Props = {
  teamId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function CreateProjectModal({ teamId, isOpen, onOpenChange }: Props) {
  const { org: organization } = useOrganizationContext();
  // const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useCreateProject(
    organization?.id ?? "",
    teamId,
  );

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
    reset,
  } = useForm<ProjectSchemaType>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      summary: "",
      color: "#6366f1",
      status: "backlog",
      priority: "no-priority",
      isPrivate: false,
    },
  });

  const onSubmit = (data: ProjectSchemaType) => {
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
      heading="Create Project"
    >
      <Form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        {/* PROJECT NAME */}
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <InlineInput
              initialValue={field.value}
              onSave={(val) => field.onChange(val)}
              schema={projectSchema.shape.name}
              debounceMs={0}
              placeholder="Project Name"
              label="Name"
            />
          )}
        />

        {/* SUMMARY */}
        <Controller
          control={control}
          name="summary"
          render={({ field }) => (
            <InlineBlockNote
              initialValue={field.value ?? ""}
              onSave={(val) => field.onChange(val)}
              schema={projectSchema.shape.summary}
              debounceMs={0}
              label="Summary"
              placeholder="Summary"
            />
          )}
        />

        <div className="flex flex-col flex-wrap gap-4">
          {/* STATUS */}
          <Controller
            control={control}
            name="status"
            render={({ field }) => {
              return (
                <StatusSelect value={field.value} onChange={field.onChange} />
              );
            }}
          />

          {/* PRIORITY */}
          <Controller
            control={control}
            name="priority"
            render={({ field }) => {
              return (
                <PrioritySelect value={field.value} onChange={field.onChange} />
              );
            }}
          />

          {/* PROJECT LEAD (Single Member Select) */}
          <Controller
            control={control}
            name="leadId"
            render={({ field }) => {
              return (
                <AssigneeSelect
                  value={field.value || []}
                  onChange={field.onChange}
                />
              );
            }}
          />

          {/* Project Members */}
          <Controller
            control={control}
            name="members"
            render={({ field }) => {
              return (
                <AssigneeSelect
                  value={field.value || []}
                  onChange={field.onChange}
                />
              );
            }}
          />
        </div>

        {/* TIMELINE SECTION */}
        <div className="">
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <DateSelect
                label="Start Date"
                value={field.value}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <DateSelect
                label="End Date"
                value={field.value}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
        </div>

        <Button
          type="submit"
          variant="secondary"
          isPending={isPending}
          // isDisabled={!isValid}
          className="ml-auto"
        >
          {({ isPending }) => (
            <>
              {isPending && <Spinner color="current" size="sm" />}
              Create Project
            </>
          )}
        </Button>
      </Form>
    </PopupModal>
  );
}
