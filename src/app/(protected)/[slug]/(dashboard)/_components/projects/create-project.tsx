"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectSchema,
  type ProjectSchemaType,
} from "@/zod-schema/project-schema";
import { Button, Form, Separator, Spinner } from "@heroui/react";
import PopupModal from "@/components/modal";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { useCreateProject } from "@/hooks/use-projects";
import StatusSelect from "../input-fields/status-select";
import PrioritySelect from "../input-fields/priority-select";
import InlineInput from "../input-fields/input";
import InlineBlockNote from "../input-fields/block-note-input";
import DateSelect from "../input-fields/date-picker";
import TeamMembersSelect from "../input-fields/team-members-select";
import ProjectMembersSelect from "../input-fields/project-members-select";

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
      <Form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
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

        <Controller
          control={control}
          name="summary"
          render={({ field }) => (
            <InlineBlockNote
              initialValue={field.value ?? ""}
              onSave={(val) => field.onChange(val)}
              schema={projectSchema.shape.summary}
              debounceMs={0}
              num={1}
              label="Summary"
              placeholder="Summary"
            />
          )}
        />

        <div className="my-2 flex gap-4">
          <Controller
            control={control}
            name="status"
            render={({ field }) => {
              return (
                <StatusSelect
                  mode="create"
                  value={field.value}
                  onChange={field.onChange}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="priority"
            render={({ field }) => {
              return (
                <PrioritySelect
                  mode="create"
                  value={field.value}
                  onChange={field.onChange}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="leadId"
            render={({ field }) => {
              return (
                <TeamMembersSelect
                  teamId={teamId}
                  placeholderText="Lead"
                  mode="create"
                  value={field.value || []}
                  onChange={field.onChange}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="members"
            render={({ field }) => {
              return (
                <ProjectMembersSelect
                  selection="multiple"
                  teamId={teamId}
                  placeholderText="Members"
                  mode="create"
                  value={field.value || []}
                  onChange={field.onChange}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <DateSelect
                placeholderText="Start"
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
                placeholderText="End"
                value={field.value}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
        </div>

        <Separator />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <InlineBlockNote
              initialValue={field.value ?? ""}
              onSave={(val) => field.onChange(val)}
              schema={projectSchema.shape.description}
              debounceMs={0}
              label="Description"
              placeholder="Description"
            />
          )}
        />

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
