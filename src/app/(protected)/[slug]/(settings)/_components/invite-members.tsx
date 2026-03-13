"use client";

import { useSendInvitation } from "@/hooks/use-invitations";
import { type InviteType, inviteSchema } from "@/zod-schema/invite-schema";
import { Envelope } from "@gravity-ui/icons";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Modal,
  Spinner,
  Surface,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

type Props = {
  slug: string;
  orgId: string;
  teamId?: string;
  isOpen: boolean;
  setOpen: (val: boolean) => void;
  onOpenChange: (val: boolean) => void;
  heading: string;
};

const InviteMembers = ({
  orgId,
  slug,
  teamId,
  isOpen,
  setOpen,
  onOpenChange,
  heading,
}: Props) => {
  const inviteMutation = useSendInvitation(orgId, slug, teamId);

  const form = useForm<InviteType>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit = async (values: InviteType) => {
    inviteMutation.mutate(values, {
      onSuccess: () => {
        // state.close();
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(isOpen) => onOpenChange(isOpen)}>
      {/* <Button
        fullWidth
        onPress={() => {
          if (onOpenChange) {
            onOpenChange();
          }
        }}
        variant="primary"
      >
        Invite Members
      </Button> */}
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="z-[999] sm:max-w-md">
            <Form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                  <Envelope className="size-5" />
                </Modal.Icon>
                <Modal.Heading>{heading}</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="px-1 py-4">
                <Controller
                  control={control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="email"
                      isInvalid={fieldState.invalid}
                    >
                      <Label>Email</Label>
                      <Input
                        variant="secondary"
                        placeholder="john@example.com"
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </TextField>
                  )}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button onPress={() => setOpen(false)} variant="secondary">
                  Cancel
                </Button>
                <Button isPending={inviteMutation.isPending} type="submit">
                  {({ isPending }) => (
                    <>
                      {isPending ? <Spinner color="current" size="sm" /> : null}
                      Invite Member
                    </>
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default InviteMembers;
