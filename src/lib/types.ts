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
  orgId: string;
  teamId: string | null;
  projectId: string | null;
};
