"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectSchema,
  type ProjectSchemaType,
} from "@/zod-schema/project-schema";
import {
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
  type Selection,
} from "@heroui/react";
import { useState } from "react";
import PopupModal from "@/components/modal";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { useCreateProject } from "@/hooks/use-projects";
import { format } from "date-fns";
import StatusSelect from "../input-fields/status-select";
import PrioritySelect from "../input-fields/priority-select";
import AssigneeSelect from "../input-fields/assignee-select";
import InlineInput from "../input-fields/input";
import StartDatePicker from "../input-fields/date-picker";

type Props = {
  teamId: string;
};

export function CreateProjectModal({ teamId }: Props) {
  const { org: organization } = useOrganizationContext();
  const [isOpen, setIsOpen] = useState(false);
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
        setIsOpen(false);
      },
    });
  };

  console.log(errors);

  return (
    <PopupModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      heading="Create Project"
      triggerText="New Project"
    >
      <Form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4">
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
        </div>

        {/* SUMMARY */}
        <Controller
          control={control}
          name="summary"
          render={({ field }) => (
            <InlineInput
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
                  label="Project Lead"
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
              <TextField className="flex-1">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={
                    field.value
                      ? format(new Date(field.value), "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? new Date(e.target.value) : null,
                    )
                  }
                />
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <TextField className="flex-1">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={
                    field.value
                      ? format(new Date(field.value), "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? new Date(e.target.value) : null,
                    )
                  }
                />
              </TextField>
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
