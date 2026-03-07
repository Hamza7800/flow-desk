"use server";

import { getUser } from "@/server/better-auth/server";
import { inviteSchema, type InviteType } from "@/zod-schema/invite-schema";
import { auth } from "@/server/better-auth";
import { headers } from "next/headers";
import { returnError } from "@/lib/utils";
// import { checkPermission } from "@/lib/permissions-checks";

// const checkInvitePermission = async (
//   id: string,
//   permission: "create" | "cancel",
// ) => {
//   const result = await auth.api.hasPermission({
//     headers: await headers(),
//     body: {
//       organizationId: id,
//       permissions: {
//         invitation: [permission],
//       },
//     },
//   });

//   if (result.error) {
//     throw new Error(result.error);
//   }

//   return result;
// };

export const inviteUserToWorkspace = async (
  orgId: string,
  values: InviteType,
  teamId?: string,
) => {
  try {
    await getUser();
    // await checkInvitePermission(orgId, "create");
    // await checkPermission('invitation', 'create')

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
    // console.error("Invite failed", error);

    // if (error instanceof z.ZodError) {
    //   return {
    //     success: false,
    //     error: "Validation failed",
    //     details: error.message,
    //   };
    // }
    // return {
    //   success: false,
    //   error: error instanceof Error ? error.message : "Invite failed",
    // };
  }
};

export const acceptInvitation = async (inviteId: string) => {
  try {
    await getUser();

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
    //   console.error("Invite accept failed", error);

    //   let errorMessage = "Invite accept failed";

    //   if (error?.body?.message) {
    //     errorMessage = error.body.message;
    //   } else if (error instanceof Error) {
    //     errorMessage = error.message;
    //   }

    //   return {
    //     success: false,
    //     message: errorMessage,
    //   };
  }
};

export const cancelInvitation = async (inviteId: string) => {
  try {
    await getUser();

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
    //   console.error("Invite cancel failed", error);

    //   let errorMessage = "Invite cancel failed";

    //   if (error?.body?.message) {
    //     errorMessage = error.body.message;
    //   } else if (error instanceof Error) {
    //     errorMessage = error.message;
    //   }

    //   return {
    //     success: false,
    //     message: errorMessage,
    //   };
  }
};

export const rejectInvitation = async (inviteId: string) => {
  try {
    await getUser();

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
    // console.error("Invitation reject", error);

    // let errorMessage = "Failed to reject invitation";

    // if (error?.body?.message) {
    //   errorMessage = error.body.message;
    // } else if (error instanceof Error) {
    //   errorMessage = error.message;
    // }

    // return {
    //   success: false,
    //   message: errorMessage,
    // };
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
    // console.error("User Invitation failed", error);

    // let errorMessage = "Failed to get user invitations";

    // if (error?.body?.message) {
    //   errorMessage = error.body.message;
    // } else if (error instanceof Error) {
    //   errorMessage = error.message;
    // }

    // return {
    //   success: false,
    //   message: errorMessage,
    // };
  }
};
