"use server";

import { auth } from "@/server/better-auth";
import { getUser } from "@/server/better-auth/server";
import { teamSchema, type TeamSchemaType } from "@/zod-schema/teams-schema";
import { headers } from "next/headers";
import z from "zod";

export const checkPermission = async (
  permission: "create" | "update" | "delete",
) => {
  return await auth.api.hasPermission({
    body: {
      permissions: {
        team: [permission],
      },
    },
    headers: await headers(),
  });
};

const returnError = (error: any, message: string) => {
  console.error(message, error);

  let errorMessage = message;

  if (error?.body?.message) {
    errorMessage = error.body.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error instanceof z.ZodError) {
    errorMessage = error.message;
  }

  return {
    success: false,
    message: errorMessage,
    data: null,
  };
};

export const createTeam = async (orgId: string, values: TeamSchemaType) => {
  try {
    await getUser();
    const validatedValues = teamSchema.parse(values);

    const hasPermission = await checkPermission("create");

    console.log(hasPermission);
    if (!hasPermission.success) {
      return {
        success: false,
        message: "You don't have permission to create team",
      };
    }

    const data = await auth.api.createTeam({
      body: {
        name: validatedValues.name,
        organizationId: orgId,
      },
    });

    if (!data) {
      return {
        success: false,
        message: "Unable to create team",
      };
    }
    return {
      success: true,
      message: "Team Created",
    };
  } catch (error) {
    return returnError(error, "Unable to create team");
  }
};

export const updateTeam = async (teamId: string, values: TeamSchemaType) => {
  try {
    await getUser();
    const hasPermission = await checkPermission("update");

    if (!hasPermission.success) {
      return {
        success: false,
        message: "You don't have permission to update team",
      };
    }
    const validatedData = teamSchema.parse(values);

    const data = await auth.api.updateTeam({
      body: {
        teamId,
        data: {
          name: validatedData.name,
        },
      },
      headers: await headers(),
    });

    if (!data) {
      return {
        success: false,
        message: "Unable to update team",
      };
    }

    return {
      success: true,
      message: "Team Updated",
      data,
    };
  } catch (error) {
    return returnError(error, "Unable to update team");
  }
};

export const removeTeam = async (teamId: string, organizationId: string) => {
  try {
    await getUser();

    const hasPermission = await checkPermission("delete");

    if (!hasPermission.success) {
      return {
        success: false,
        message: "You don't have permission to delete team",
      };
    }

    const data = await auth.api.removeTeam({
      body: {
        teamId,
        organizationId,
      },
      headers: await headers(),
    });
    if (!data) {
      return {
        success: false,
        message: "Unable to remove team",
      };
    }

    return {
      success: true,
      message: "Team Removed",
      data,
    };
  } catch (error) {
    return returnError(error, "Unable to remove team");
  }
};

export const setActiveTeam = async (teamId: string) => {
  try {
    await getUser();

    const data = await auth.api.setActiveTeam({
      body: {
        teamId,
      },
      headers: await headers(),
    });

    if (!data) {
      return {
        success: false,
        message: "Unable to set  team active",
      };
    }

    return {
      success: true,
      message: `${data.name} Team set active`,
      data,
    };
  } catch (error) {
    return returnError(error, "Unable to set team active");
  }
};

export const getOrgTeams = async (orgId: string) => {
  try {
    await getUser();
    const data = await auth.api.listOrganizationTeams({
      query: {
        organizationId: orgId,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Organization Teams",
      data,
    };
  } catch (error) {
    return returnError(error, "Unable to get teams");
  }
};

export const getUserTeams = async (orgId: string) => {
  try {
    await getUser();
    const data = await auth.api.listUserTeams({
      headers: await headers(),
    });

    return {
      success: true,
      message: "User Teams",
      data,
    };
  } catch (error) {
    return returnError(error, "Unable to get user teams");
  }
};
