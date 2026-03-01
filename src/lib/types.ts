import type { IssuesType } from "@/server-actions/issues";
import type z from "zod";

export type SelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export type InputType = {
  initialValue: string;
  onSave: (value: string) => void;
  schema: z.ZodString | z.ZodOptional<z.ZodString> | z.ZodNullable<z.ZodString>;
  placeholder?: string;
  label?: string;
  className?: string;
  debounceMs?: number;
};

export type IssueSnapshot = {
  orgId?: string | null;
  teamId?: string | null;
  projectId?: string | null;
};

export type ListGroup = {
  group: {
    key: string;
    label: string;
    icon: string;
    color: string;
    issues: NonNullable<IssuesType["data"]>;
  };
};
