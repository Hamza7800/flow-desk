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
import { useOrganizationContext } from "./context/organization-client-context";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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

// TODO: ADD LABELS and PROJECTS
export function CreateIssueModal({
  isOpen,
  onOpenChange,
  orgId,
  teamId,
}: Props) {
  const { mutate, isPending } = useCreateIssue(orgId, teamId);
  const { org: organization } = useOrganizationContext();
  const members = organization?.members;

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
        onOpenChange(false);
      },
    });
  };

  console.log(members);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button variant="secondary">Open Modal</Button>

      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[600px]">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>Create Issue</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="px-2">
              <Form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* TITLE */}
                <Controller
                  control={control}
                  name="title"
                  render={({ field, fieldState }) => (
                    <TextField isInvalid={fieldState.invalid}>
                      <Label>Title</Label>
                      <Input {...field} placeholder="Issue title" />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </TextField>
                  )}
                />

                {/* DESCRIPTION */}
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <TextField>
                      <Label>Description</Label>
                      <TextArea {...field} placeholder="Add description..." />
                    </TextField>
                  )}
                />

                {/* STATUS DROPDOWN */}
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => {
                    const [selected, setSelected] = useState<Selection>(
                      new Set([field.value]),
                    );

                    return (
                      <Dropdown>
                        <Button variant="secondary">{field.value}</Button>

                        <Dropdown.Popover>
                          <Dropdown.Menu
                            selectionMode="single"
                            selectedKeys={selected}
                            onSelectionChange={(keys) => {
                              setSelected(keys);
                              const value = Array.from(keys)[0] as string;
                              field.onChange(value);
                            }}
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <Dropdown.Item
                                id={status.key}
                                key={status.key}
                                className="text-zinc-300"
                              >
                                {status.label}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    );
                  }}
                />

                {/* PRIORITY DROPDOWN */}
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => {
                    const [selected, setSelected] = useState<Selection>(
                      new Set([field.value]),
                    );

                    return (
                      <Dropdown>
                        <Button variant="secondary">{field.value}</Button>

                        <Dropdown.Popover>
                          <Dropdown.Menu
                            selectionMode="single"
                            selectedKeys={selected}
                            onSelectionChange={(keys) => {
                              setSelected(keys);
                              const value = Array.from(keys)[0] as string;
                              field.onChange(value);
                            }}
                          >
                            {PRIORITY_OPTIONS.map((priority) => (
                              <Dropdown.Item
                                id={priority.key}
                                key={priority.key}
                                className="text-zinc-300"
                              >
                                {priority.label}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    );
                  }}
                />
                <Controller
                  control={control}
                  name="assigneeIds"
                  render={({ field }) => {
                    const selectedKeys = new Set(field.value ?? []);

                    console.log(selectedKeys);
                    console.log(field.value);

                    const triggerLabel =
                      field.value?.length === 0 || !field.value
                        ? "Assignee"
                        : field.value.length === 1
                          ? members?.find((m) => m.user.id === field.value![0])
                              ?.user.email
                          : `${field.value.length} Assignees`;

                    return (
                      <Dropdown>
                        <Button aria-label="Assignee" variant="secondary">
                          {triggerLabel}
                        </Button>
                        <Dropdown.Popover className="w-full">
                          <Dropdown.Menu
                            selectionMode="multiple"
                            selectedKeys={selectedKeys}
                            onSelectionChange={(keys) => {
                              field.onChange(Array.from(keys) as string[]);
                            }}
                          >
                            <Dropdown.Section>
                              <Header>Select Member</Header>
                              {members?.map((member) => (
                                <Dropdown.Item
                                  key={member.user.id}
                                  id={member.user.id}
                                  className="text-zinc-300"
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
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
