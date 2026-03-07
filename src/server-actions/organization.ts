"use server";

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

    return {
      success: true,
      message: "Organization Created",
      data: data,
    };
  } catch (error) {
    return returnError(error, "Error creating organization");
  }
};

// TODO: Maybe I should
// FIXME: This get full organization, we need only org details not full org
export const getOrganization = cache(async (slug: string) => {
  try {
    await getUser();

    const organization = await auth.api.getFullOrganization({
      query: {
        organizationSlug: slug,
      },
      headers: await headers(),
    });

    if (!organization) {
      return {
        success: false,
        message: "Organization not found",
      };
    }
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
    await getUser();

    const data = await auth.api.listOrganizations({
      headers: await headers(),
    });

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
    await getUser();

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
    await getUser();
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
    await getUser();
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
    return {
      success: true,
      message: "Organization updated success",
      data,
    };
  } catch (error: any) {
    return returnError(error, "Unable to update organization");
  }
};

export const removeMemberFromOrg = async (userId: string) => {
  try {
    const { orgId } = await getActiveOrgId();

    const data = await auth.api.removeMember({
      body: {
        memberIdOrEmail: userId,
        organizationId: orgId,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "User removed",
      data,
    };
  } catch (error) {
    return returnError(error, "Unable to remove from org");
  }
};
