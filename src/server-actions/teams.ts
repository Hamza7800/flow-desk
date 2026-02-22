"use server";

import { checkPermission } from "@/lib/permissions-checks";
import { returnError } from "@/lib/utils";
import { auth } from "@/server/better-auth";
import { getUser } from "@/server/better-auth/server";
import { db } from "@/server/db";
import { team, teamMember } from "@/server/db/schema";
import { teamSchema, type TeamSchemaType } from "@/zod-schema/teams-schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

// export const checkPermission = async (
//   permission: "create" | "update" | "delete",
// ) => {
//   return await auth.api.hasPermission({
//     body: {
//       permissions: {
//         team: [permission],
//       },
//     },
//     headers: await headers(),
//   });
// };

export const createTeam = async (orgId: string, values: TeamSchemaType) => {
  try {
    const user = await getUser();
    const validatedValues = teamSchema.parse(values);

    const hasPermission = await checkPermission("team", "create");

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

    await auth.api.addTeamMember({
      body: {
        teamId: data.id,
        userId: user.id,
      },
      headers: await headers(),
    });

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
    const hasPermission = await checkPermission("team", "update");

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

    const hasPermission = await checkPermission("team", "delete");

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

export const getUserTeamsCurrentOrg = async (orgId: string) => {
  try {
    const user = await getUser();
    const data = await db
      .select({
        id: team.id,
        name: team.name,
        organizationId: team.organizationId,
        createdAt: team.createdAt,
      })
      .from(team)
      .innerJoin(teamMember, eq(team.id, teamMember.teamId))
      .where(
        and(eq(team.organizationId, orgId), eq(teamMember.userId, user.id)),
      );

    return {
      success: true,
      message: "User Teams",
      data,
    };
  } catch (error) {
    return returnError(error, "Unable to get user teams");
  }
};

// TODO: WHEN INVITE YOU CAN ALSO SPECIFY A TEAM BY DEFAULT

export const addMemberToTeam = async (teamId: string) => {
  try {
    const user = await getUser();

    const data = await auth.api.addTeamMember({
      body: {
        teamId,
        userId: user.id,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Team Joined",
      data,
    };
  } catch (error) {
    return returnError(error, "Unable to join team");
  }
};

export const removeMemberFromTeam = async (teamId: string) => {
  try {
    const user = await getUser();

    const data = await auth.api.removeTeamMember({
      body: {
        teamId,
        userId: user.id,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Team Left",
      data,
    };
  } catch (error) {
    return returnError(error, "Unable to leave team");
  }
};
