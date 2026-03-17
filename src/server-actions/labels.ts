"use server";

import { returnError } from "@/lib/utils";
import { getActiveOrgId } from "@/server/better-auth/server";
import { db } from "@/server/db";
import { label } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const getLabels = async () => {
  try {
    const { orgId } = await getActiveOrgId();
    const labels = await db.query.label.findMany({
      where: and(eq(label.organizationId, orgId)),
    });

    return {
      success: true,
      message: "Org labels",
      data: labels,
    };
  } catch (error) {
    return returnError(error, "Unable to get labels");
  }
};
