"use server";

import { getUser } from "@/server/better-auth/server";
import { inviteSchema, type InviteType } from "@/zod-schema/invite-schema";
import { auth } from "@/server/better-auth";
import { headers } from "next/headers";
import { returnError } from "@/lib/utils";

export const inviteUserToWorkspace = async (
  orgId: string,
  values: InviteType,
  teamId?: string,
) => {
  try {
    const validatedData = inviteSchema.parse(values);

    const inviteResult = await auth.api.createInvitation({
      body: {
        email: validatedData.email,
        organizationId: orgId,
        resend: true,
        role: "member",
        teamId,
      },
      headers: await headers(),
    });

    if (!inviteResult) {
      return {
        success: false,
        message: "Unable to send invite",
      };
    }

    return {
      success: true,
      message: "Invite sent",
      data: inviteResult,
    };
  } catch (error) {
    return returnError(error, "Invite failed");
  }
};

export const acceptInvitation = async (inviteId: string) => {
  try {
    const data = await auth.api.acceptInvitation({
      body: {
        invitationId: inviteId,
      },
      headers: await headers(),
    });

    if (!data) {
      return {
        success: false,
        message: "Unable to accept invite",
      };
    }

    return {
      success: true,
      message: "Invite accepted",
      data,
    };
  } catch (error: any) {
    return returnError(error, "Unable to accept invite");
  }
};

export const cancelInvitation = async (inviteId: string) => {
  try {
    const data = await auth.api.cancelInvitation({
      body: {
        invitationId: inviteId,
      },
      headers: await headers(),
    });

    if (!data) {
      return {
        success: false,
        message: "Unable to cancel invite",
      };
    }

    return {
      success: true,
      message: "Invite canceled",
      data,
    };
  } catch (error: any) {
    return returnError(error, "Unable to cancel invite");
  }
};

export const rejectInvitation = async (inviteId: string) => {
  try {
    const data = await auth.api.rejectInvitation({
      body: {
        invitationId: inviteId,
      },
      headers: await headers(),
    });

    if (!data) {
      return {
        success: false,
        message: "Unable to reject invite",
      };
    }

    return {
      success: true,
      message: "Invite rejected",
      data,
    };
  } catch (error: any) {
    return returnError(error, "Unable to reject invite");
  }
};

export const getUserInvites = async () => {
  try {
    const user = await getUser();

    const invitations = await auth.api.listUserInvitations({
      query: {
        email: user.email,
      },
    });

    return {
      success: true,
      message: "User Invitations",
      data: invitations,
    };
  } catch (error: any) {
    return returnError(error, "Unable to get user invites");
  }
};
