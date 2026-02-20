"use client";

import { useOrganizationDelete } from "@/hooks/use-organizations";
import { ArrowUpFromLine, Sparkles } from "@gravity-ui/icons";
import {
  AlertDialog,
  Button,
  DangerIcon,
  Spinner,
  useOverlayState,
} from "@heroui/react";
import React, { useState } from "react";

const animationStyles = {
  backdrop: [
    "data-[entering]:duration-500",
    "data-[entering]:ease-[cubic-bezier(0.25,1,0.5,1)]",
    "data-[exiting]:duration-200",
    "data-[exiting]:ease-[cubic-bezier(0.5,0,0.75,0)]",
  ].join(" "),
  container: [
    "data-[entering]:animate-in",
    "data-[entering]:fade-in-0",
    "data-[entering]:slide-in-from-bottom-4",
    "data-[entering]:duration-500",
    "data-[entering]:ease-[cubic-bezier(0.25,1,0.5,1)]",
    "data-[exiting]:animate-out",
    "data-[exiting]:fade-out-0",
    "data-[exiting]:slide-out-to-bottom-2",
    "data-[exiting]:duration-200",
    "data-[exiting]:ease-[cubic-bezier(0.5,0,0.75,0)]",
  ].join(" "),
};

const DeleteWorkspace = ({ slug }: { slug: string }) => {
  const state = useOverlayState();

  const { mutate, isPending } = useOrganizationDelete();

  const handleDelete = () => {
    mutate(slug, {
      onSuccess: () => {
        state.close();
      },
    });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <AlertDialog isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Button onPress={() => state.open()} variant="secondary">
          Delete Workspace
        </Button>

        <AlertDialog.Backdrop className={animationStyles.backdrop}>
          <AlertDialog.Container className={animationStyles.container}>
            <AlertDialog.Dialog className="sm:max-w-[400px]">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon status="accent">
                  <DangerIcon className="size-5" />
                </AlertDialog.Icon>
                <AlertDialog.Heading>
                  Delete Workspace Permanently
                </AlertDialog.Heading>
              </AlertDialog.Header>

              <AlertDialog.Body>
                <p className="mt-1">
                  This action will delete your workspace and all the data
                  including members, teams, projects and all related data.
                </p>
              </AlertDialog.Body>

              <AlertDialog.Footer>
                <Button slot="close" variant="tertiary" isPending={isPending}>
                  Close
                </Button>
                <Button isPending={isPending} onPress={handleDelete}>
                  {({ isPending }) => (
                    <>
                      {isPending ? <Spinner color="current" size="sm" /> : null}
                      Confirm
                    </>
                  )}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </div>
  );
};
export default DeleteWorkspace;
