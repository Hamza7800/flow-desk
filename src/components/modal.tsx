import { Modal } from "@heroui/react";
import type { ReactNode } from "react";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  heading: string;
  children: ReactNode;
};

const PopupModal = ({ isOpen, onOpenChange, heading, children }: Props) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="w-[90%] max-w-[800px]">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>{heading}</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="">{children}</Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default PopupModal;
