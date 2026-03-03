"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import type { Block } from "@blocknote/core";

interface EditorProps {
  initialContent?: string;
  onChange: (jsonString: string) => void;
}

export default function Editor({ initialContent, onChange }: EditorProps) {
  const editor = useCreateBlockNote({
    initialContent: (() => {
      if (!initialContent) return undefined;

      try {
        // Try to parse as JSON (new format)
        return JSON.parse(initialContent) as Block[];
      } catch (e) {
        // Fallback: It's old plain text.
        // We return nothing here to let it be empty,
        // or you can manually wrap it in a block:
        console.warn("Content is not JSON, treating as empty or plain text");
        return undefined;
      }
    })(),
  });

  return (
    <BlockNoteView
      editor={editor}
      sideMenu={false}
      onChange={() => {
        const jsonString = JSON.stringify(editor.document);
        onChange(jsonString);
      }}
    />
  );
}
