"use server";

import { isProjectLead } from "@/lib/permissions-checks";
import { returnError } from "@/lib/utils";
import { auth } from "@/server/better-auth";
import { getActiveOrgId } from "@/server/better-auth/server";
import { headers } from "next/headers";

export const getCurrentMemberRole = async () => {
  try {
    const { role } = await auth.api.getActiveMemberRole({
      headers: await headers(),
    });

    return {
      success: true,
      message: "User role",
      data: role,
    };
  } catch (error) {
    return returnError(error, "Unable to get user role");
  }
};

export const updateMemberRole = async (
  memberId: string,
  newRole: "admin" | "member",
) => {
  try {
    const { orgId } = await getActiveOrgId();
    const { role: callerRole } = await auth.api.getActiveMemberRole({
      headers: await headers(),
    });

    if (callerRole !== "owner" && callerRole !== "admin") {
      throw new Error("Unauthorized: You don't have permission");
    }

    if (newRole === "admin" && callerRole !== "owner") {
      throw new Error("Only owners can promote to admin");
    }

    const data = await auth.api.updateMemberRole({
      body: {
        role: newRole,
        memberId,
        organizationId: orgId,
      },
      headers: await headers(),
    });

    return {
      success: true,
      data,
      message: "Member role updated to " + data.role,
    };
  } catch (error) {
    return returnError(error, "Unable to update user role");
  }
};

export const getProjectLead = async (projectId: string) => {
  try {
    const { userId } = await getActiveOrgId();
    const isLead = await isProjectLead(projectId, userId);

    return {
      success: true,
      message: "Project Lead",
      data: isLead,
    };
  } catch (error) {
    return returnError(error, "Unable to get project lead");
  }
};
