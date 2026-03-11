"use client";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import Editor from "./editor";
import type { InputType } from "@/lib/types";

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
      <Editor
        initialContent={initialValue}
        onChange={(val) => setBlocksJson(val)}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InlineBlockNote;
