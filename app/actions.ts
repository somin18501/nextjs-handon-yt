"use server";

import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/lib/auth";
import { postSchema, PostSchemaType } from "@/schema/blog";
import { fetchMutation } from "convex/nextjs";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

// NOTE: This file is for defining server actions that interact with Convex functions

export const createBlogPost = async (values: PostSchemaType) => {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error("Invalid input value's type");
    }

    const token = await getAuthToken();

    if (!token) {
      throw new Error("Not signed in");
    }

    const postImageUploadUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token },
    );

    const { storageId: imageStorageId } = await fetch(postImageUploadUrl, {
      method: "POST",
      headers: { "Content-Type": parsed.data.image.type },
      body: parsed.data.image,
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to upload image");
      }
      return res.json();
    });

    if (!imageStorageId) {
      throw new Error("Failed to get image ID");
    }

    await fetchMutation(
      api.posts.createPost,
      { title: parsed.data.title, body: parsed.data.content, imageStorageId },
      { token },
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create blog post");
  }

  // revalidatePath("/blogs"); // NOTE: This will clear the cache and force a revalidation in ISR
  // revalidateTag("blog-list"); // NOTE: This will mark the cache stale and revalidate in cacheComponents, it does not work in "use server" context
  updateTag("blog-list"); // NOTE: This will clear the cache and force a revalidation in cacheComponents
  redirect("/blogs");
};
