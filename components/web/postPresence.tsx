"use client";

import { api } from "@/convex/_generated/api";
import FacePile from "@convex-dev/presence/facepile";
import usePresence from "@convex-dev/presence/react";
import React from "react";

const PostPresence: React.FC<{ roomId: string; userId: string }> = ({
  roomId,
  userId,
}) => {
  const presenceState = usePresence(api.presence, roomId, userId);

  if (!presenceState || presenceState.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        Viewing now
      </p>
      <div className="text-black">
        <FacePile presenceState={presenceState} />
      </div>
    </div>
  );
};

export default PostPresence;
