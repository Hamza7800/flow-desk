"use client";
import { getAuthenticatedUser } from "@/server-actions/users";
import { authClient } from "@/server/better-auth/client";
import { Button, Card } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "better-auth";
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { LinkButton } from "@/components/link-button";
import WorkspaceLayoutSkeleton from "@/components/skeletons/workspace-layout-skeleton";
import { appCache } from "@/lib/cache";

type AuthContextType = {
  logout: () => void;
  user: User | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    isPending,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const res = await getAuthenticatedUser();
      if (!res.success) {
        throw new Error(res.message);
      }
      return res.user;
    },
    retry: false,
  });

  const logout = async () => {
    await authClient.signOut();
    queryClient.resetQueries();
    await appCache.clear();
    router.replace("/sign-in");
  };

  if (isPending) {
    return <WorkspaceLayoutSkeleton />;
  }

  if (isError) {
    if (error.message.includes("Unauthorized")) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Card className="mx-auto flex w-lg items-center justify-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              !
            </div>

            <h2 className="text-xl font-semibold">Unauthorized</h2>

            <p className="text-muted-foreground mt-2 text-sm">
              Please login to continue to dashboard.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <LinkButton href="" onClick={() => refetch()}>
                Try Again
              </LinkButton>

              <LinkButton href="/sign-in">Go to Login</LinkButton>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="bg-card w-full max-w-md rounded-2xl border p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
            !
          </div>

          <h2 className="text-xl font-semibold">Something went wrong</h2>

          <p className="text-muted-foreground mt-2 text-sm">
            We couldn't verify your session. Please try again.
          </p>
          {/* <p className="text-muted-foreground mt-2 text-sm">{error.message}</p> */}

          <div className="mt-6 flex justify-center gap-3">
            <LinkButton href="" onClick={() => refetch()}>
              Retry
            </LinkButton>

            <LinkButton href="/sign-in">Go to Login</LinkButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
