import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/web/commentSection";
import PostPresence from "@/components/web/postPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/auth";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface BlogPostPageProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}

export const generateMetadata = async ({
  params,
}: BlogPostPageProps): Promise<Metadata> => {
  const { postId } = await params;
  const post = await fetchQuery(api.posts.getPostById, { postId });

  return {
    title: post?.title || "Blog Post",
    description: post?.body || "Blog Post",
    category: "blog",
  };
};

const BlogPostPage: React.FC<BlogPostPageProps> = async ({ params }) => {
  const { postId } = await params;

  const token = await getAuthToken();

  const [post, preloadedComments, userId] = await Promise.all([
    fetchQuery(api.posts.getPostById, { postId }),
    preloadQuery(api.comments.getCommentsByPostId, { postId }), // NOTE: This should be used with usePreloadedQuery in client component
    fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  // NOTE: This is double check for authentication as one is check  proxy.ts
  if (!userId) {
    return redirect("/sign-in");
  }

  if (!post) {
    return (
      <div>
        <h1 className="text-6xl font-extrabold text-red-500 p-20">
          No post found
        </h1>
      </div>
    );
  }

  return (
    <>
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
        href="/blogs"
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>

      <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in druation-500 relative">
        <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm">
          <Image
            src={
              post.imageUrl ??
              "https://images.unsplash.com/photo-1761019646782-4bc46ba43fe9?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={post.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="space-y-4 flex flex-col">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {post.title}
          </h1>

          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Posted on:{" "}
              {new Date(post._creationTime).toLocaleDateString("en-US")}
            </p>
            {userId ? <PostPresence roomId={post._id} userId={userId} /> : null}
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {post.body}
        </p>

        <Separator className="my-8" />

        <CommentSection preloadedComments={preloadedComments} />
      </div>
    </>
  );
};

export default BlogPostPage;
