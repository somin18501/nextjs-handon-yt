import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
// import { api } from "@/convex/_generated/api";
// import { useQuery } from "convex/react";
// import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import React from "react";

// export const dynamic = "force-static"; // NOTE: This is to prevent dynamic rendering
// This was part of ISR (Incremental Static Regeneration) to cache the page for a specific time in CDN, this allow entire page to be cached(static) but in cacheComponents we can cache static and dynamic parts of the page separately
// export const revalidate = 30; // NOTE: This is to cache the page for 30 seconds

export const metadata: Metadata = {
  title: "Blogs",
  description: "Blogs page",
  category: "blog",
  authors: [{ name: "Somin" }],
};

const BlogList = async () => {
  // "use cache"; // NOTE: To allow caching of dynamic part of the page we need to use this directive
  // cacheLife("hours"); // NOTE: This is to cache the dynamic part for 1 hour, it is the way in next.js 16 cacheComponents
  // cacheTag("blog-list");

  // NOTE: This is a done to allow fetching of data on server along with cache static part and wrap dynamic part in suspense.
  // This is done under (PPR) Partial Pre-rendering(next.js 15) which is a base of cacheComponents in next.js 16
  await connection();
  // const data = useQuery(api.posts.getPosts); // NOTE: This is client side fetching and it's reactive

  const data = await fetchQuery(api.posts.getPosts); // NOTE: This is server side fetching but its not reactive i.e. it won't update when the data changes

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => (
        <Card key={post._id} className="pt-0">
          <div className="relative h-60 w-full overflow-hidden">
            <Image
              src={
                post.imageUrl ??
                "https://images.unsplash.com/photo-1761019646782-4bc46ba43fe9?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt="image"
              fill
              className="rounded-t-lg object-cover"
            />
          </div>

          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <h1 className="text-2xl font-bold hover:text-primary">
                {post.title}
              </h1>
            </Link>
            <p className="text-muted-foreground line-clamp-3">{post.body}</p>
          </CardContent>
          <CardFooter>
            <Link
              className={buttonVariants({
                className: "w-full",
              })}
              href={`/blogs/${post._id}`}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

function SkeletonLoadingUi() {
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div className="flex flex-col space-y-3" key={i}>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/" />
          </div>
        </div>
      ))}
    </div>
  );
}

const BlogsPage: React.FC = () => {
  return (
    <>
      <div className="py-12">
        <div className="text-center pb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Our Blog
          </h1>
          <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            Insights, thoughts, and trends from our team.
          </p>
        </div>
      </div>

      {/* NOTE: We can remove suspense boundary if we want to cache dynamic part using "use-cache" */}
      {/* <React.Suspense fallback={<SkeletonLoadingUi />}> */}
      <BlogList />
      {/* </React.Suspense> */}
    </>
  );
};

export default BlogsPage;
