import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@heroui/react";
import { Ripple } from "m3-ripple";
import { auth } from "@/server/better-auth";
import { getSession } from "@/server/better-auth/server";

export default async function Home() {
  const session = await getSession();

  return (
    <Button>
      {/* <Ripple /> */}
      My Button
    </Button>
  );
}
