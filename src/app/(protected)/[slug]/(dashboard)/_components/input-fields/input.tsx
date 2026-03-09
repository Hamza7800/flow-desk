import type { InputType } from "@/lib/types";
import { Input, TextField } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

const InlineInput = ({
  initialValue,
  onSave,
  schema,
  placeholder,
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
    <TextField aria-label="Text Field" className={className}>
      <Input
        className="w-full border-none bg-transparent px-1 text-xl shadow-none ring-0 outline-none placeholder:text-zinc-500 focus:ring-0 focus:outline-none focus-visible:ring-0"
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
      {error && <p className="mb-1 text-xs text-red-500">{error}</p>}
    </TextField>
  );
};

export default InlineInput;
