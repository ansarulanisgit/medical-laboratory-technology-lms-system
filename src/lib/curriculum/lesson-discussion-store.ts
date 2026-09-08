"use client";

import * as React from "react";
import { UserRole } from "@/types/roles";
import { createClient } from "@/lib/supabase/client";
import { useAcademicProfile } from "@/lib/curriculum/academic-context";
import { useNotification } from "@/components/ui/notification-context";
import { LessonQA } from "./study-center-store";

export interface DiscussionReply {
  id: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
  isFacultyAnswer: boolean;
  likes: string[];
  dislikes: string[];
}

export interface DiscussionItem {
  id: string;
  category?: string;
  askedBy?: string;
  authorId?: string;
  question: string;
  facultyResponse?: string;
  createdAt: string;
  likes: string[];
  dislikes: string[];
  replies: DiscussionReply[];
}

export function useLessonDiscussion(
  subjectCode: string,
  lessonId: string,
  initialQas?: LessonQA[]
) {
  const { profile } = useAcademicProfile();
  const { notify } = useNotification();
  const [items, setItems] = React.useState<DiscussionItem[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);

  const storageKey = React.useMemo(
    () => `labtutor_discussion_v3_${subjectCode}_${lessonId}`.toLowerCase(),
    [subjectCode, lessonId]
  );

  const currentUserId = profile?.email || profile?.username || "guest-user";
  const currentUserName = profile?.fullName || profile?.username || "MLT Scholar";
  const currentUserRole = profile?.role || "STUDENT";

  // 1. Initialize from localStorage or fallback to lesson QAs
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: DiscussionItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          return;
        }
      }
    } catch {}

    // Seed from currentLesson.qas if available
    let seedItems: DiscussionItem[] = [];
    if (initialQas && initialQas.length > 0) {
      seedItems = initialQas.map((qa, idx) => ({
        id: qa.id || `seed-${lessonId}-${idx + 1}`,
        category: qa.category || "Clinical Practice",
        askedBy: qa.askedBy || "Clinical Trainee Query",
        question: qa.question,
        facultyResponse: qa.answer,
        createdAt: new Date(Date.now() - 3600000 * (idx + 1) * 2).toISOString(),
        likes: ["user-1", "user-2"],
        dislikes: [],
        replies: [],
      }));
    } else {
      seedItems = [
        {
          id: `seed-${lessonId}-default`,
          category: "Pre-Analytical",
          askedBy: "Clinical Trainee Query",
          question: `What are the critical pre-analytical precautions when performing tests for this lesson?`,
          facultyResponse:
            "Ensure specimen is unhemolyzed, collected in the proper anticoagulant tube, mixed by gentle inversion 8-10 times, and centrifuged at 3000 RPM for 10 minutes within 1 hour of phlebotomy.",
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          likes: ["user-1"],
          dislikes: [],
          replies: [],
        },
      ];
    }

    setItems(seedItems);
    try {
      localStorage.setItem(storageKey, JSON.stringify(seedItems));
    } catch {}
  }, [storageKey, lessonId, initialQas]);

  // Persist and broadcast updates
  const persistAndSync = React.useCallback(
    (newItems: DiscussionItem[], broadcast = true) => {
      setItems(newItems);
      try {
        localStorage.setItem(storageKey, JSON.stringify(newItems));
      } catch {}

      if (broadcast) {
        try {
          const supabase = createClient();
          const channelName = `discussion-${subjectCode}-${lessonId}`.replace(/[^a-zA-Z0-9_-]/g, "_");
          const channel = supabase.channel(channelName);
          channel.send({
            type: "broadcast",
            event: "SYNC_DISCUSSION_ITEMS",
            payload: { items: newItems, senderId: currentUserId },
          });
        } catch {}
      }
    },
    [storageKey, subjectCode, lessonId, currentUserId]
  );

  // 2. Real-Time Supabase Channel
  React.useEffect(() => {
    let channel: any = null;
    try {
      const supabase = createClient();
      const channelName = `discussion-${subjectCode}-${lessonId}`.replace(/[^a-zA-Z0-9_-]/g, "_");
      channel = supabase.channel(channelName, {
        config: { broadcast: { self: false } },
      });

      channel
        .on("broadcast", { event: "SYNC_DISCUSSION_ITEMS" }, ({ payload }: any) => {
          if (payload?.items && Array.isArray(payload.items)) {
            setItems(payload.items);
            try {
              localStorage.setItem(storageKey, JSON.stringify(payload.items));
            } catch {}
          }
        })
        .on("broadcast", { event: "NEW_REPLY_ALERT" }, ({ payload }: any) => {
          if (payload?.questionAuthorId === currentUserId && payload?.senderId !== currentUserId) {
            notify({
              type: "info",
              title: "New Reply on Your Question!",
              message: `${payload.senderName} replied to: "${payload.questionText}"`,
              duration: 5000,
            });
          }
        })
        .subscribe((status: string) => {
          if (status === "SUBSCRIBED") {
            setIsConnected(true);
          } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
            setIsConnected(false);
          }
        });
    } catch {
      setIsConnected(false);
    }

    return () => {
      if (channel) {
        try {
          channel.unsubscribe();
        } catch {}
      }
    };
  }, [subjectCode, lessonId, storageKey, currentUserId, notify]);

  // 3. Action: Post Question
  const askQuestion = React.useCallback(
    (questionText: string) => {
      if (!questionText.trim()) return;

      const newItem: DiscussionItem = {
        id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        category: "Clinical Query",
        askedBy: currentUserName,
        authorId: currentUserId,
        question: questionText.trim(),
        createdAt: new Date().toISOString(),
        likes: [],
        dislikes: [],
        replies: [],
      };

      const updated = [...items, newItem];
      persistAndSync(updated);

      notify({
        type: "success",
        title: "Question Posted",
        message: "Your clinical question has been published to this lesson discussion.",
        duration: 3500,
      });
    },
    [currentUserName, currentUserId, items, persistAndSync, notify]
  );

  // 4. Action: Reply to Question
  const addReply = React.useCallback(
    (questionId: string, replyText: string) => {
      if (!replyText.trim()) return;

      const targetQuestion = items.find((it) => it.id === questionId);
      if (!targetQuestion) return;

      const isFaculty =
        currentUserRole === "SUPER_ADMIN" ||
        currentUserRole === "ADMIN" ||
        currentUserRole === "MENTOR";

      const newReply: DiscussionReply = {
        id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        authorName: currentUserName,
        authorRole: currentUserRole,
        content: replyText.trim(),
        createdAt: new Date().toISOString(),
        isFacultyAnswer: isFaculty,
        likes: [],
        dislikes: [],
      };

      const updated = items.map((it) => {
        if (it.id === questionId) {
          return {
            ...it,
            replies: [...it.replies, newReply],
          };
        }
        return it;
      });

      persistAndSync(updated);

      // Broadcast alert
      try {
        const supabase = createClient();
        const channelName = `discussion-${subjectCode}-${lessonId}`.replace(/[^a-zA-Z0-9_-]/g, "_");
        const channel = supabase.channel(channelName);
        channel.send({
          type: "broadcast",
          event: "NEW_REPLY_ALERT",
          payload: {
            questionText: targetQuestion.question,
            questionAuthorId: targetQuestion.authorId,
            senderId: currentUserId,
            senderName: currentUserName,
          },
        });
      } catch {}

      notify({
        type: "success",
        title: "Reply Published",
        message: isFaculty
          ? "Your verified faculty response has been added."
          : "Your answer has been posted to the discussion thread.",
        duration: 3500,
      });
    },
    [
      items,
      currentUserRole,
      currentUserName,
      currentUserId,
      persistAndSync,
      subjectCode,
      lessonId,
      notify,
    ]
  );

  // 5. Action: Toggle Vote (Like / Dislike) on Question or Reply
  const toggleVote = React.useCallback(
    (
      targetType: "question" | "reply",
      questionId: string,
      replyId: string | undefined,
      voteType: "like" | "dislike"
    ) => {
      const updated = items.map((q) => {
        if (targetType === "question" && q.id === questionId) {
          let nextLikes = [...q.likes];
          let nextDislikes = [...q.dislikes];

          if (voteType === "like") {
            if (nextLikes.includes(currentUserId)) {
              nextLikes = nextLikes.filter((id) => id !== currentUserId);
            } else {
              nextLikes.push(currentUserId);
              nextDislikes = nextDislikes.filter((id) => id !== currentUserId);
            }
          } else {
            if (nextDislikes.includes(currentUserId)) {
              nextDislikes = nextDislikes.filter((id) => id !== currentUserId);
            } else {
              nextDislikes.push(currentUserId);
              nextLikes = nextLikes.filter((id) => id !== currentUserId);
            }
          }

          return { ...q, likes: nextLikes, dislikes: nextDislikes };
        }

        if (targetType === "reply" && q.id === questionId && replyId) {
          const updatedReplies = q.replies.map((rep) => {
            if (rep.id === replyId) {
              let nextLikes = [...rep.likes];
              let nextDislikes = [...rep.dislikes];

              if (voteType === "like") {
                if (nextLikes.includes(currentUserId)) {
                  nextLikes = nextLikes.filter((id) => id !== currentUserId);
                } else {
                  nextLikes.push(currentUserId);
                  nextDislikes = nextDislikes.filter((id) => id !== currentUserId);
                }
              } else {
                if (nextDislikes.includes(currentUserId)) {
                  nextDislikes = nextDislikes.filter((id) => id !== currentUserId);
                } else {
                  nextDislikes.push(currentUserId);
                  nextLikes = nextLikes.filter((id) => id !== currentUserId);
                }
              }

              return { ...rep, likes: nextLikes, dislikes: nextDislikes };
            }
            return rep;
          });

          return { ...q, replies: updatedReplies };
        }

        return q;
      });

      persistAndSync(updated);
    },
    [items, currentUserId, persistAndSync]
  );

  return {
    items,
    isConnected,
    currentUserId,
    askQuestion,
    addReply,
    toggleVote,
  };
}
