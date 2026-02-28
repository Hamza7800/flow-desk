import type { InputType } from "@/lib/types";
import { Input, Label, TextField } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import type z from "zod";

const InlineInput = ({
  initialValue,
  onSave,
  schema,
  placeholder,
  label,
  className,
  debounceMs = 700,
}: InputType) => {
  const [text, setText] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [debouncedText] = useDebounce(text, debounceMs);
  const isInitialMount = useRef(true);

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debouncedText === initialValue) return;

    const result = schema.safeParse(debouncedText);
    console.log(result.error);
    if (result.success) {
      setError(null);
      onSave(debouncedText);
    } else {
      setError(result.error.issues[0]?.message ?? "Invalid input");
    }
  }, [debouncedText, initialValue]);

  return (
    <TextField isInvalid={!!error} className={className}>
      <Label className="text-xs text-zinc-500">{label}</Label>
      <Input
        value={text}
        onChange={(e) => {
          const val = e.target.value;
          setText(val);
          const result = schema.safeParse(val);
          if (!result.success) {
            setError(result.error.issues[0]?.message ?? "Invalid input");
          } else {
            setError(null);
          }
        }}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </TextField>
  );
};

export default InlineInput;
