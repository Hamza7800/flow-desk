"use server";

import { returnError } from "@/lib/utils";
import { auth } from "@/server/better-auth";
import { getUser } from "@/server/better-auth/server";
import {
  organizationSchema,
  type OrganizationSchemaType,
} from "@/zod-schema/organization-schema";
import { headers } from "next/headers";
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
    // console.error("Error creating organization:", error);
    // if (error instanceof z.ZodError) {
    //   return {
    //     success: false,
    //     error: "Validation failed",
    //     details: error.message,
    //   };
    // }
    // return {
    //   success: false,
    //   error:
    //     error instanceof Error
    //       ? error.message
    //       : "Failed to create organization",
    // };
  }
};

// TODO: Maybe I should
// FIXME: This get full organization, we need only org details not full org
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
      data: organization,
    };
  } catch (error) {
    return returnError(error, "Error fetching organization");
    // console.error("Error fetching organization:", error);

    // return {
    //   success: false,
    //   error:
    //     error instanceof Error
    //       ? error.message
    //       : "Failed to fetching organization",
    // };
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
    // console.error("Error fetch organizations:", error);

    // return {
    //   success: false,
    //   error:
    //     error instanceof Error
    //       ? error.message
    //       : "Failed to fetch organizations",
    // };
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
    // console.error("Error setting active organization:", error);

    // return {
    //   success: false,
    //   error:
    //     error instanceof Error
    //       ? error.message
    //       : "Failed to set organization active",
    // };
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
    // console.error("Error delete  organization:", error);

    // return {
    //   success: false,
    //   error:
    //     error instanceof Error
    //       ? error.message
    //       : "Failed to delete organization ",
    // };
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
    // console.error("Error updating  organization:", error);

    // let errorMessage = "Failed to update organization";

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
