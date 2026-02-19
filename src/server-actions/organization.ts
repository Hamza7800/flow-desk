"use server";

import { auth } from "@/server/better-auth";
import { getUser } from "@/server/better-auth/server";
import {
  organizationSchema,
  type OrganizationSchemaType,
} from "@/zod-schema/organization-schema";
import { headers } from "next/headers";
import z, { success } from "zod";

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
    console.error("Error creating organization:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.message,
      };
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create organization",
    };
  }
};

export const getOrganization = async (slug: string) => {
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
      organization,
    };
  } catch (error) {
    console.error("Error fetching organization:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetching organization",
    };
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
    console.error("Error fetch organizations:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch organizations",
    };
  }
};

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
    console.error("Error setting active organization:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to set organization active",
    };
  }
};
