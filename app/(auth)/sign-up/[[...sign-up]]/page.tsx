import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage: React.FC = () => {
  return (
    <div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <SignUp signInUrl="/sign-in" />
      </React.Suspense>
    </div>
  );
};

export default SignUpPage;
