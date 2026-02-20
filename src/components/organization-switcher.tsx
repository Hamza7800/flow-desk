"use client";

import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button, Dropdown, Spinner } from "@heroui/react";
import {
  useOrganizationsList,
  useSetOrgActive,
} from "@/hooks/use-organizations";
import { authClient } from "@/server/better-auth/client";

export function OrganizationSwitcher() {
  const action = useSetOrgActive();
  const { data: organizations, isPending, isError } = useOrganizationsList();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  if (isPending || action.isPending) {
    return <Spinner />;
  }

  if (isError) {
    <h2>Unable to get Organizations</h2>;
  }

  if (action.isError) {
    <h2>Unable to set Organization active</h2>;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown className="">
          {/* <Button aria-label="Menu" variant="secondary"> */}
          <Button size="lg" fullWidth>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-1 text-left leading-none">
              <span className="font-medium">{activeOrganization?.name}</span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </Button>
          {/* </Button> */}
          <Dropdown.Popover className={"w-[230px]"}>
            <Dropdown.Menu
              className="w-(--radix-dropdown-menu-trigger-width)"
              // align="start"
            >
              {organizations?.map((org) => (
                <Dropdown.Item
                  key={org.id}
                  textValue={org.slug}
                  id={org.slug}
                  onClick={() => {
                    action.mutate({ id: org.id, slug: org.slug });
                  }}
                  // onSelect={() => setSelectedVersion(version)}
                >
                  {org.name}{" "}
                  {org.slug === activeOrganization?.slug && (
                    <Check className="ml-auto" />
                  )}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// "use client";

// import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
// import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
// import { Button, Dropdown, Spinner } from "@heroui/react";
// import {
//   useOrganizationsList,
//   useSetOrgActive,
// } from "@/hooks/use-organizations";
// import { useParams } from "next/navigation";

// export function OrganizationSwitcher() {
//   const { slug } = useParams();
//   const action = useSetOrgActive();
//   const { data: organizations, isPending } = useOrganizationsList();

//   if (isPending || action.isPending) {
//     return <Spinner />;
//   }

//   const activeOrg = organizations?.find((org) => org.slug === slug);

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <Dropdown>
//           <Button size="lg" fullWidth>
//             <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
//               <GalleryVerticalEnd className="size-4" />
//             </div>

//             <div className="flex flex-col gap-1 text-left leading-none">
//               <span className="font-medium">
//                 {activeOrg?.name || "Select Organization"}
//               </span>
//             </div>

//             <ChevronsUpDown className="ml-auto" />
//           </Button>

//           <Dropdown.Popover className="w-[230px]">
//             <Dropdown.Menu>
//               {organizations?.map((org) => (
//                 <Dropdown.Item
//                   key={org.id}
//                   onClick={() => action.mutate({ id: org.id, slug: org.slug })}
//                 >
//                   {org.name}
//                   {org.slug === slug && <Check className="ml-auto" />}
//                 </Dropdown.Item>
//               ))}
//             </Dropdown.Menu>
//           </Dropdown.Popover>
//         </Dropdown>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }
