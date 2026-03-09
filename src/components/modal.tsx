import { Button, Modal } from "@heroui/react";
import type { ReactNode } from "react";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  triggerText: string;
  heading: string;
  children: ReactNode;
};

const PopupModal = ({
  isOpen,
  onOpenChange,
  triggerText,
  heading,
  children,
}: Props) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button variant="secondary">{triggerText}</Button>

      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="w-[90%] max-w-[800px]">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>{heading}</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="px-1">{children}</Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default PopupModal;
