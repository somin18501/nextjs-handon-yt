import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

export const postSchema = z.object({
  title: z.string().min(3, "Title is too short").max(50, "Title is too long"),
  content: z.string().min(10, "Content is too short"),
  image: z.instanceof(File),
});

export type PostSchemaType = z.infer<typeof postSchema>;

export const commentSchema = z.object({
  body: z.string().min(1, "Comment is required"),
  postId: z.custom<Id<"posts">>(),
});

export type CommentSchemaType = z.infer<typeof commentSchema>;
