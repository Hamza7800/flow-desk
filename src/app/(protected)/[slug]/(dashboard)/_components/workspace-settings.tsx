import { LinkButton } from "@/components/link-button";
import { getCurrentMemberRole } from "@/server-actions/members";
import { Accordion, ErrorMessage } from "@heroui/react";
import { ChevronDown, UserSquare2, UsersRoundIcon } from "lucide-react";
import { Suspense } from "react";

const data = {
  navMain: [
    {
      title: "Workspace",
      items: [
        {
          title: "Members",
          url: "/members",
          icon: <UsersRoundIcon size={14} />,
        },
        {
          title: "Teams",
          url: "/teams",
          icon: <UserSquare2 size={14} />,
        },
      ],
    },
  ],
};

const Content = async ({ slug }: { slug: string }) => {
  try {
    const result = await getCurrentMemberRole();
    if (!result.success) {
      throw new Error("Unable get role");
    }
    const userRole = result.data;

    return (
      userRole !== "member" &&
      data.navMain.map((item) => (
        <Accordion
          key={item.title}
          className={"py-0"}
          defaultExpandedKeys={["workspace"]}
        >
          <Accordion.Item id={"workspace"}>
            <Accordion.Heading>
              <Accordion.Trigger>
                {item.title}
                <Accordion.Indicator>
                  <ChevronDown />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel className={""}>
              {item.items.map((item) => (
                <LinkButton
                  className={"justify-start gap-3 text-left shadow-none"}
                  fullWidth
                  variant="ghost"
                  key={item.title}
                  href={`/${slug}/${item.url}`}
                >
                  {item.icon} {item.title}
                </LinkButton>
              ))}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      ))
    );
  } catch (error: any) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }
};

const WorkspaceSettings = ({ slug }: { slug: string }) => {
  return (
    <Suspense fallback={null}>
      <Content slug={slug} />
    </Suspense>
  );
};

export default WorkspaceSettings;
