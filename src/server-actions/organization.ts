"use server";

import { cacheDel, cacheWrap } from "@/lib/cache";
import { checkPermission } from "@/lib/permissions-checks";
import { cacheKeys } from "@/lib/query-keys";
import { returnError } from "@/lib/utils";
import { auth } from "@/server/better-auth";
import { getActiveOrgId, getUser } from "@/server/better-auth/server";
import { db } from "@/server/db";
import { organization } from "@/server/db/schema";
import {
  organizationSchema,
  type OrganizationSchemaType,
} from "@/zod-schema/organization-schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
import z from "zod";

export const checkSlug = async (slug: string) => {
  const data = await auth.api.checkOrganizationSlug({
    body: {
      slug,
    },
  });

  return data.status;
};

export const createOrganization = async (values: OrganizationSchemaType) => {
  try {
    const user = await getUser();
    const validatedData = organizationSchema.parse(values);
    const isSlugAvailable = await checkSlug(validatedData.slug);

    if (!isSlugAvailable) {
      return {
        success: false,
        message: "Slug is already in use",
      };
    }

    const data = await auth.api.createOrganization({
      body: {
        name: validatedData.name,
        slug: validatedData.slug,
        userId: user.id,
        keepCurrentActiveOrganization: true,
      },
      headers: await headers(),
    });

    if (!data) {
      return {
        success: false,
        message: "Unable to create organization",
      };
    }

    await cacheDel(cacheKeys.organizations.list(user.id));

    return {
      success: true,
      message: "Organization Created",
      data: data,
    };
  } catch (error) {
    return returnError(error, "Error creating organization");
  }
};

export const getOrganization = cache(async (slug: string) => {
  try {
    const t0 = Date.now();

    const { orgId } = await getActiveOrgId();
    // console.log(`① ORG getActiveOrgId: ${Date.now() - t0}ms`);

    const t1 = Date.now();

    const organization = await cacheWrap(
      cacheKeys.organizations.detail(orgId),
      async () =>
        await auth.api.getFullOrganization({
          query: {
            organizationSlug: slug,
          },
          headers: await headers(),
        }),
      1000 * 60 * 10,
    );

    if (!organization) {
      return {
        success: false,
        message: "Organization not found",
      };
    }

    // console.log(`③ ORG cacheWrap: ${Date.now() - t1}ms`);
    // console.log(`④ ORG getOrg total: ${Date.now() - t0}ms`);

    return {
      success: true,
      data: organization,
    };
  } catch (error) {
    return returnError(error, "Error fetching organization");
  }
});

export const getActiveOrg = cache(async () => {
  try {
    const { orgId } = await getActiveOrgId();
    return {
      success: true,
      data: orgId,
      message: "Active Org",
    };
  } catch (error) {
    return returnError(error, "Error fetching active organization");
  }
});

export const getOrganizationById = async (orgId: string) => {
  try {
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, orgId),
    });

    if (!org) return { success: false, data: null, message: "Not found" };
    return { success: true, data: org, message: "OK" };
  } catch (error) {
    return returnError(error, "Error fetching organization");
  }
};

export type OrgType = Awaited<ReturnType<typeof getOrganization>>;

export const getUserListOrganizations = async () => {
  try {
    const user = await getUser();
    // const { userId } = await getActiveOrgId();

    const data = await cacheWrap(
      cacheKeys.organizations.list(user.id),
      async () => auth.api.listOrganizations({ headers: await headers() }),
      1000 * 60 * 10,
    );

    if (!data) {
      return {
        success: false,
        message: "You don't have any organizations",
      };
    }
    return {
      success: true,
      message: "Your organizations",
      data,
    };
  } catch (error) {
    return returnError(error, "Unable to get organizations");
  }
};

export type UserOrgType = Awaited<ReturnType<typeof getUserListOrganizations>>;

export const setActiveOrganization = async (orgId: string, slug: string) => {
  try {
    const { userId, orgId: previousOrgId } = await getActiveOrgId();

    const data = await auth.api.setActiveOrganization({
      body: {
        organizationId: orgId,
        organizationSlug: slug,
      },
      headers: await headers(),
    });

    if (!data) {
      return {
        success: false,
        message: "Unable to set  organization active",
      };
    }

    await Promise.all([
      cacheDel(cacheKeys.issues.byUserAssigned(userId, previousOrgId)),
      cacheDel(cacheKeys.issues.byUserCreated(userId, previousOrgId)),
      cacheDel(cacheKeys.issues.orgList(previousOrgId)),
      cacheDel(cacheKeys.members.list(previousOrgId)),
    ]);

    return {
      success: true,
      message: `${data.name} Organization set active`,
      data,
    };
  } catch (error) {
    return returnError(error, "Unable to set organization active");
  }
};

export const deleteOrganization = async (slug: string) => {
  try {
    const { orgId, userId } = await getActiveOrgId();
    const result = await getOrganization(slug);

    if (!result.success || !result.data) return result;

    const data = await auth.api.deleteOrganization({
      body: {
        organizationId: result.data.id,
      },
      headers: await headers(),
    });

    if (!data) {
      return {
        success: false,
        message: "Unable to delete organization",
      };
    }

    await cacheDel(
      cacheKeys.organizations.detail(orgId),
      cacheKeys.organizations.list(userId),
    );

    return {
      success: true,
      message: `${data.name} deleted`,
      data,
    };
  } catch (error) {
    return returnError(error, "Unable to delete organization");
  }
};

export const updateOrganization = async (
  orgId: string,
  values: OrganizationSchemaType,
) => {
  try {
    const { orgId, userId } = await getActiveOrgId();
    const validatedData = organizationSchema.parse(values);

    // const isSlugAvailable = await checkSlug(validatedData.slug);

    // if (!isSlugAvailable) {
    //   return {
    //     success: false,
    //     message: "Slug is already in use",
    //   };
    // }

    const data = await auth.api.updateOrganization({
      body: {
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
        },
        organizationId: orgId,
      },
      headers: await headers(),
    });

    if (!data) {
      return {
        success: false,
        message: "Unable to update organization",
      };
    }

    await cacheDel(
      cacheKeys.organizations.detail(orgId),
      cacheKeys.organizations.list(userId),
    );

    return {
      success: true,
      message: "Organization updated success",
      data,
    };
  } catch (error: any) {
    return returnError(error, "Unable to update organization");
  }
};

export const removeMemberFromOrg = async (
  userId: string,
  action: "leave" | "remove",
) => {
  try {
    const { orgId } = await getActiveOrgId();
    // const { success: canLeave } = await checkPermission(
    //   "organization",
    //   "leave",
    // );
    // const { success: canRemove } = await checkPermission(
    //   "organization",
    //   "removeMember",
    // );

    // if (action === "leave" && !canLeave) {
    //   return {
    //     success: false,
    //     data: null,
    //     message: "You don't have permission to leave",
    //   };
    // }

    // if (action === "remove" && !canRemove) {
    //   return {
    //     success: false,
    //     data: null,
    //     message: "You don't have permission to remove member",
    //   };
    // }

    const data = await auth.api.removeMember({
      body: {
        memberIdOrEmail: userId,
        organizationId: orgId,
      },
      headers: await headers(),
    });

    await cacheDel(cacheKeys.organizations.detail(orgId));

    return {
      success: true,
      message: "User removed",
      data,
    };
  } catch (error) {
    return returnError(error, "Unable to remove from org");
  }
};
