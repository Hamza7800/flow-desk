import { issueSchema } from "@/zod-schema/issue-schema";
import InlineInput from "./input";

export const IssueTitle = ({
  issue,
  onUpdate,
}: {
  issue: any;
  onUpdate: any;
}) => {
  return (
    <InlineInput
      initialValue={issue.title}
      placeholder="Issue title"
      schema={issueSchema.shape.title}
      onSave={(newTitle) => onUpdate({ title: newTitle })}
      className="max-w-2xl"
    />
  );
};
