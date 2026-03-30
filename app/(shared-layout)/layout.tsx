import { Navbar } from "@/components/web/navbar";
import React from "react";

const SharedLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default SharedLayout;
