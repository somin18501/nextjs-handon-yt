import Link from "next/link";
import React from "react";

export const Navbar: React.FC = () => {
  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div>
          <Link href="/">
            <h1 className="text-3xl font-bold">
              Next<span className="text-blue-500">Pro</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/create">Create</Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/auth/signup">Sign Up</Link>
        <Link href="/auth/signin">Sign In</Link>
      </div>
    </nav>
  );
};
