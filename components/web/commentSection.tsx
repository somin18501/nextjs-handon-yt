"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { commentSchema, CommentSchemaType } from "@/schema/blog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Loader2, MessageSquare } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CommentSectionProps {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  preloadedComments,
}) => {
  const [isPending, startTransition] = React.useTransition();

  const params = useParams<{ postId: Id<"posts"> }>();

  // NOTE: This is used for realtime querying but can work only in client component
  // const data = useQuery(api.comments.getCommentsByPostId, {
  //   postId: params.postId,
  // });
  const data = usePreloadedQuery(preloadedComments); // NOTE: This should be used with preloadQuery convex function in server component
  const commentMutation = useMutation(api.comments.createComment);

  const form = useForm({
    defaultValues: {
      body: "",
      postId: params.postId,
    },
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = (data: CommentSchemaType) => {
    startTransition(async () => {
      try {
        await commentMutation(data);
        toast.success("Comment added successfully");
        form.reset();
      } catch (error) {
        console.error("Failed to create comment:", error);
        toast.error("Failed to add comment");
      }
    });
  };

  if (data === undefined) {
    return <p>loading...</p>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{data.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thoughts"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Comment</span>
            )}
          </Button>
        </form>

        {data?.length > 0 && <Separator />}

        <section className="space-y-6">
          {data?.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(comment._creationTime).toLocaleDateString(
                      "en-US",
                    )}
                  </p>
                </div>

                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
};

export default CommentSection;
