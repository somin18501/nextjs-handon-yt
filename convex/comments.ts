import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCommentsByPostId = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const data = await ctx.db
      .query("comments")
      .filter((com) => com.eq(com.field("postId"), args.postId))
      .order("desc")
      .collect();

    return data;
  },
});

export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError("Not authenticated");
    }

    const comment = await ctx.db.insert("comments", {
      postId: args.postId,
      body: args.body,
      authorId: identity.subject,
      authorName:
        identity.name ||
        identity.preferredUsername ||
        identity.email ||
        "Anonymous",
    });
    return comment;
  },
});
