import { getUser } from "@/server/better-auth/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};
const Page = async ({ params }: Props) => {
  const { slug } = await params;

  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  redirect(`/${slug}/settings/account/profile`);
};

export default Page;
