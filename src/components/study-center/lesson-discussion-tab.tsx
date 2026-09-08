"use client";

import * as React from "react";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLessonDiscussion } from "@/lib/curriculum/lesson-discussion-store";
import { LessonQA } from "@/lib/curriculum/study-center-store";

interface LessonDiscussionTabProps {
  lessonId: string;
  lessonTitle: string;
  subjectCode: string;
  subjectName: string;
  initialQas?: LessonQA[];
}

function formatTimeAgo(dateString: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return "Recently";
  }
}

export function LessonDiscussionTab({
  lessonId,
  lessonTitle,
  subjectCode,
  subjectName,
  initialQas,
}: LessonDiscussionTabProps) {
  const {
    items,
    isConnected,
    currentUserId,
    askQuestion,
    addReply,
    toggleVote,
  } = useLessonDiscussion(subjectCode, lessonId, initialQas);

  // New question text in bottom card
  const [questionInput, setQuestionInput] = React.useState("");

  // Map of questionId -> open state of reply section
  const [openReplies, setOpenReplies] = React.useState<Record<string, boolean>>({});

  // Map of questionId -> reply input text
  const [replyInputs, setReplyInputs] = React.useState<Record<string, string>>({});

  const toggleReplyOpen = (qId: string) => {
    setOpenReplies((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;

    askQuestion(questionInput.trim());
    setQuestionInput("");
  };

  const handleReplySubmit = (qId: string) => {
    const text = replyInputs[qId] || "";
    if (!text.trim()) return;

    addReply(qId, text.trim());
    setReplyInputs((prev) => ({ ...prev, [qId]: "" }));
    setOpenReplies((prev) => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-1 border-b border-border">
        <span className="text-xs font-semibold text-foreground flex items-center gap-2">
          <span>Clinical Discussion &amp; Forum ({items.length})</span>
          {isConnected && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Real-Time
            </span>
          )}
        </span>
      </div>

      {/* Discussion Question Cards */}
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">
          No questions posted yet. Be the first to ask!
        </p>
      ) : (
        <div className="space-y-3.5">
          {items.map((item) => {
            const userLiked = item.likes.includes(currentUserId);
            const userDisliked = item.dislikes.includes(currentUserId);
            const isReplyExpanded = openReplies[item.id] ?? false;

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-3 shadow-2xs transition-all hover:border-border/90"
              >
                {/* Question Card Top Meta */}
                <div className="flex items-center justify-between text-xs gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {item.category || "Clinical Practice"}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                    {item.askedBy || "Student Query"} • {formatTimeAgo(item.createdAt)}
                  </span>
                </div>

                {/* Question Title / Content */}
                <h6 className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                  {item.question}
                </h6>

                {/* Faculty Response Box (if available) */}
                {item.facultyResponse && (
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-primary font-bold">
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                      <span>Faculty Response:</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-normal">
                      {item.facultyResponse}
                    </p>
                  </div>
                )}

                {/* Actions: Like, Dislike and Reply/Answer */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/60 flex-wrap">
                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={() => toggleVote("question", item.id, undefined, "like")}
                    className={cn(
                      "h-8 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border select-none",
                      userLiked
                        ? "bg-primary text-primary-foreground border-primary shadow-2xs scale-[1.02]"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-transparent"
                    )}
                    title="Like"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>Like</span>
                    {item.likes.length > 0 && (
                      <span className="ml-0.5 font-bold">({item.likes.length})</span>
                    )}
                  </button>

                  {/* Dislike Button */}
                  <button
                    type="button"
                    onClick={() => toggleVote("question", item.id, undefined, "dislike")}
                    className={cn(
                      "h-8 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border select-none",
                      userDisliked
                        ? "bg-rose-500 text-white border-rose-500 shadow-2xs scale-[1.02]"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-transparent"
                    )}
                    title="Dislike"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                    <span>Dislike</span>
                    {item.dislikes.length > 0 && (
                      <span className="ml-0.5 font-bold">({item.dislikes.length})</span>
                    )}
                  </button>

                  {/* Reply / Answer Button */}
                  <button
                    type="button"
                    onClick={() => toggleReplyOpen(item.id)}
                    className={cn(
                      "h-8 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border select-none",
                      isReplyExpanded
                        ? "bg-muted text-foreground border-border/80"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-transparent"
                    )}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Reply / Answer</span>
                    {item.replies.length > 0 && (
                      <span className="ml-0.5 font-bold">({item.replies.length})</span>
                    )}
                  </button>
                </div>

                {/* Threaded Replies / Answers Section */}
                {isReplyExpanded && (
                  <div className="space-y-3 pt-3 pl-2 sm:pl-4 border-l-2 border-primary/30 ml-1 animate-in fade-in duration-150">
                    {/* Existing Replies List */}
                    {item.replies.length > 0 && (
                      <div className="space-y-2.5">
                        {item.replies.map((rep) => {
                          const repLiked = rep.likes.includes(currentUserId);
                          const repDisliked = rep.dislikes.includes(currentUserId);

                          return (
                            <div
                              key={rep.id}
                              className={cn(
                                "p-3 rounded-xl border text-xs space-y-2",
                                rep.isFacultyAnswer
                                  ? "bg-primary/5 border-primary/25"
                                  : "bg-muted/30 border-border"
                              )}
                            >
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-foreground">
                                    {rep.authorName}
                                  </span>
                                  {rep.isFacultyAnswer && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary text-primary-foreground">
                                      Faculty
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                  {formatTimeAgo(rep.createdAt)}
                                </span>
                              </div>

                              <p className="text-foreground/90 leading-relaxed font-normal">
                                {rep.content}
                              </p>

                              {/* Reply Reactions */}
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => toggleVote("reply", item.id, rep.id, "like")}
                                  className={cn(
                                    "h-6 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border",
                                    repLiked
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-card hover:bg-muted text-muted-foreground border-border/60"
                                  )}
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                  <span>Like</span>
                                  {rep.likes.length > 0 && <span>({rep.likes.length})</span>}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleVote("reply", item.id, rep.id, "dislike")}
                                  className={cn(
                                    "h-6 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border",
                                    repDisliked
                                      ? "bg-rose-500 text-white border-rose-500"
                                      : "bg-card hover:bg-muted text-muted-foreground border-border/60"
                                  )}
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                  <span>Dislike</span>
                                  {rep.dislikes.length > 0 && <span>({rep.dislikes.length})</span>}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Inline Reply Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        placeholder="Write your reply or answer..."
                        value={replyInputs[item.id] || ""}
                        onChange={(e) =>
                          setReplyInputs((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleReplySubmit(item.id);
                          }
                        }}
                        className="h-9 text-xs rounded-xl bg-card border-border"
                      />
                      <Button
                        type="button"
                        onClick={() => handleReplySubmit(item.id)}
                        disabled={!(replyInputs[item.id] || "").trim()}
                        className="h-9 px-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <Send className="h-3.5 w-3.5 mr-1" />
                        <span>Reply</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Card: Ask a Question on this Lesson (Without the category dropdown!) */}
      <form
        onSubmit={handleAskSubmit}
        className="p-4 rounded-2xl border border-border bg-muted/20 space-y-3"
      >
        <span className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span>Ask a Question on this Lesson</span>
        </span>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <Input
              required
              placeholder="Type your clinical question here..."
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              className="h-10 text-xs sm:text-sm rounded-xl bg-card border-border"
            />
          </div>
          <Button
            type="submit"
            className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Post Question</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

