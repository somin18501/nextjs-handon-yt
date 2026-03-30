"use client";

import { buttonVariants } from "@/components/ui/button";
import SearchInputBar from "@/components/web/searchInputBar";
import { ThemeToggle } from "@/components/web/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import React from "react";

export const Navbar: React.FC = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div>
          <Link href="/">
            <h1 className="text-3xl font-bold">
              Next<span className="text-primary">Pro</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link className={buttonVariants({ variant: "ghost" })} href="/">
            Home
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/blogs">
            Blogs
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/create">
            Create
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SearchInputBar />
        {isLoading ? null : isAuthenticated ? (
          <UserButton />
        ) : (
          <>
            <Link className={buttonVariants()} href="/sign-up">
              Sign Up
            </Link>
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href="/sign-in"
            >
              Sign In
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
};
