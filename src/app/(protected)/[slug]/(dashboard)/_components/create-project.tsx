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
} from "@heroui/react";
import { useState } from "react";
import PopupModal from "@/components/modal";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { useCreateProject } from "@/hooks/use-projects";
import { format } from "date-fns";

type Props = {
  orgId: string;
  teamId: string;
};

const STATUS_OPTIONS = [
  { key: "backlog", label: "Backlog" },
  { key: "planned", label: "Planned" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "canceled", label: "Canceled" },
];

const PRIORITY_OPTIONS = [
  { key: "no-priority", label: "No Priority" },
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
  { key: "urgent", label: "Urgent" },
];

export function CreateProjectModal({ orgId, teamId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useCreateProject(orgId, teamId);
  const { org: organization } = useOrganizationContext();
  const members = organization?.members;

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
      identifier: "",
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
            render={({ field, fieldState }) => (
              <TextField isInvalid={fieldState.invalid} className="flex-1">
                <Label>Project Name</Label>
                <Input {...field} placeholder="e.g. Mobile App" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />

          {/* IDENTIFIER */}
          <Controller
            control={control}
            name="identifier"
            render={({ field, fieldState }) => (
              <TextField isInvalid={fieldState.invalid} className="w-32">
                <Label>ID</Label>
                <Input {...field} placeholder="APP" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />
        </div>

        {/* SUMMARY */}
        <Controller
          control={control}
          name="summary"
          render={({ field, fieldState }) => (
            <TextField isInvalid={fieldState.invalid}>
              <Label>Summary</Label>
              <TextArea {...field} placeholder="What is this project about?" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />

        <div className="flex flex-wrap gap-4">
          {/* STATUS */}
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Dropdown>
                <Button variant="secondary" className="capitalize">
                  {field.value?.replace("-", " ")}
                </Button>
                <Dropdown.Popover>
                  <Dropdown.Menu
                    selectionMode="single"
                    selectedKeys={new Set([field.value])}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <Dropdown.Item key={status.key} id={status.key}>
                        {status.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            )}
          />

          {/* PRIORITY */}
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Dropdown>
                <Button variant="secondary" className="capitalize">
                  {field.value?.replace("-", " ")}
                </Button>
                <Dropdown.Popover>
                  <Dropdown.Menu
                    selectionMode="single"
                    selectedKeys={new Set([field.value])}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }
                  >
                    {PRIORITY_OPTIONS.map((p) => (
                      <Dropdown.Item key={p.key} id={p.key}>
                        {p.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            )}
          />

          {/* PROJECT LEAD (Single Member Select) */}
          <Controller
            control={control}
            name="leadId"
            render={({ field }) => {
              const lead = members?.find((m) => m.user.id === field.value);
              return (
                <Dropdown>
                  <Button variant="secondary">
                    {lead ? lead.user.email : "Project Lead"}
                  </Button>
                  <Dropdown.Popover className="min-w-[200px]">
                    <Dropdown.Menu
                      selectionMode="single"
                      selectedKeys={
                        field.value ? new Set([field.value]) : new Set()
                      }
                      onSelectionChange={(keys) =>
                        field.onChange(Array.from(keys)[0])
                      }
                    >
                      <Dropdown.Section>
                        <Header>Assign Lead</Header>
                        {members?.map((member) => (
                          <Dropdown.Item
                            key={member.user.id}
                            id={member.user.id}
                          >
                            {member.user.email}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Section>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              );
            }}
          />
        </div>

        {/* TIMELINE SECTION */}
        <div className="flex gap-4 border-t border-zinc-800 pt-4">
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
