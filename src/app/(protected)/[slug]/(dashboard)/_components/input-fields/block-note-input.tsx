"use client";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import Editor from "./editor";
import type { InputType } from "@/lib/types";
import { Label } from "@heroui/react";

const InlineBlockNote = ({
  initialValue,
  onSave,
  schema,
  placeholder,
  className,
  label,
  debounceMs = 1000,
}: InputType) => {
  const [blocksJson, setBlocksJson] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [debouncedJson] = useDebounce(blocksJson, debounceMs);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debouncedJson === initialValue) return;

    const result = schema.safeParse(debouncedJson);
    if (result.success) {
      setError(null);
      onSave(debouncedJson);
    } else {
      setError(result.error.issues[0]?.message ?? "Invalid content");
    }
  }, [debouncedJson, initialValue]);

  return (
    <div className={`w-full ${className}`}>
      <Label className="text-xs">{label}</Label>
      <div
        className={`rounded-md border p-1 transition-colors ${
          error
            ? "border-red-500 bg-red-50/10"
            : "border-transparent hover:border-gray-200"
        }`}
      >
        <Editor
          initialContent={initialValue}
          onChange={(val) => setBlocksJson(val)}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InlineBlockNote;
