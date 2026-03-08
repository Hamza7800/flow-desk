import { Button } from "@heroui/react";
import type { ReactNode } from "react";

type ViewMode = "board" | "list";

type ViewButtonProps = {
  icon: ReactNode;
  label: string;
  mode: ViewMode;
  currentMode: ViewMode;
  setMode: (mode: ViewMode) => void;
};

const ViewChangeButton = ({
  icon,
  label,
  mode,
  currentMode,
  setMode,
}: ViewButtonProps) => {
  const active = currentMode === mode;

  return (
    <Button
      fullWidth
      onClick={() => setMode(mode)}
      variant={active ? "danger" : "ghost"}
      className="flex-col gap-0 py-8 transition-colors duration-150"
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

export default ViewChangeButton;
