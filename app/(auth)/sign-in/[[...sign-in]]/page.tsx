import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignInPage: React.FC = () => {
  return (
    <div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <SignIn />
      </React.Suspense>
    </div>
  );
};

export default SignInPage;
