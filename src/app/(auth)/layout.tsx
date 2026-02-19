// import Navbar from "@/components/navbar";
import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {/* <Navbar /> */}
      <div className="h-screen">{children}</div>
    </>
  );
};

export default AuthLayout;
