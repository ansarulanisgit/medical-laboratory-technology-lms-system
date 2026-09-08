"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RemoveFormatting,
  Undo,
  Redo,
  Code2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function WysiwygEditor({
  value,
  onChange,
  placeholder = "Provide detailed instructions, timings, room numbers, or links...",
  className,
  minHeight = "140px",
}: WysiwygEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [isHtmlMode, setIsHtmlMode] = React.useState(false);
  const [linkModalOpen, setLinkModalOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [savedSelection, setSavedSelection] = React.useState<Range | null>(null);

  // Synchronize incoming value when changed outside
  React.useEffect(() => {
    if (editorRef.current && !isHtmlMode) {
      if (editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, isHtmlMode]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (command: string, val: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, val);
      onChange(editorRef.current.innerHTML);
    }
  };

  const openLinkDialog = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedSelection(sel.getRangeAt(0).cloneRange());
    } else {
      setSavedSelection(null);
    }
    setLinkUrl("");
    setLinkModalOpen(true);
  };

  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    if (editorRef.current) {
      editorRef.current.focus();
      if (savedSelection) {
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(savedSelection);
      }
      const formattedUrl =
        linkUrl.startsWith("http://") || linkUrl.startsWith("https://") || linkUrl.startsWith("/")
          ? linkUrl
          : `https://${linkUrl}`;
      document.execCommand("createLink", false, formattedUrl);
      onChange(editorRef.current.innerHTML);
    }
    setLinkModalOpen(false);
  };

  // Text metrics
  const textContent = React.useMemo(() => {
    if (typeof document === "undefined") return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = value || "";
    return tmp.textContent || tmp.innerText || "";
  }, [value]);

  const charCount = textContent.length;
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-input bg-background overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all",
        className
      )}
    >
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border bg-muted/40 text-muted-foreground select-none">
        {/* Style Controls */}
        <button
          type="button"
          onClick={() => exec("bold")}
          title="Bold (Ctrl+B)"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all text-xs font-bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          title="Italic (Ctrl+I)"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all text-xs italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          title="Underline (Ctrl+U)"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all text-xs underline"
        >
          <Underline className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("strikeThrough")}
          title="Strikethrough"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all text-xs line-through"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => exec("formatBlock", "<p>")}
          title="Paragraph text"
          className="h-7 px-1.5 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all text-[11px] font-semibold"
        >
          P
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<h2>")}
          title="Heading 2"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all text-xs font-bold"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<h3>")}
          title="Heading 3"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all text-xs font-bold"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          title="Bullet List"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          title="Numbered List"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<blockquote>")}
          title="Quote Block"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all"
        >
          <Quote className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Alignments */}
        <button
          type="button"
          onClick={() => exec("justifyLeft")}
          title="Align Left"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("justifyCenter")}
          title="Align Center"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("justifyRight")}
          title="Align Right"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Link & Clear Format */}
        <button
          type="button"
          onClick={openLinkDialog}
          title="Insert Link"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all text-primary"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("removeFormat")}
          title="Clear Formatting"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all"
        >
          <RemoveFormatting className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => exec("undo")}
          title="Undo (Ctrl+Z)"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all"
        >
          <Undo className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("redo")}
          title="Redo (Ctrl+Y)"
          className="h-7 w-7 rounded-lg inline-flex items-center justify-center hover:bg-muted hover:text-foreground active:scale-95 transition-all"
        >
          <Redo className="h-3.5 w-3.5" />
        </button>

        {/* Source Toggle */}
        <div className="ml-auto flex items-center">
          <button
            type="button"
            onClick={() => setIsHtmlMode(!isHtmlMode)}
            title={isHtmlMode ? "Switch to Visual Mode" : "Switch to HTML Code Mode"}
            className={cn(
              "h-7 px-2 rounded-lg inline-flex items-center gap-1 text-[10px] font-medium transition-colors",
              isHtmlMode ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted hover:text-foreground"
            )}
          >
            {isHtmlMode ? <Eye className="h-3 w-3" /> : <Code2 className="h-3 w-3" />}
            <span>{isHtmlMode ? "Visual" : "HTML"}</span>
          </button>
        </div>
      </div>

      {/* Editable Body */}
      <div className="relative flex-1">
        {isHtmlMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            className="w-full p-3 font-mono text-xs leading-relaxed bg-muted/20 focus:outline-none resize-y border-none"
            placeholder="<p>Enter HTML content...</p>"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            style={{ minHeight }}
            data-placeholder={placeholder}
            className="p-3 text-xs leading-relaxed focus:outline-none overflow-y-auto max-h-[300px] prose prose-xs dark:prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/60 empty:before:pointer-events-none"
          />
        )}
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between px-3 py-1 bg-muted/20 border-t border-border/60 text-[10px] text-muted-foreground select-none">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>{isHtmlMode ? "HTML Source View" : "WYSIWYG Rich Editor"}</span>
        </span>
        <span className="space-x-2 font-mono text-[9.5px]">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </span>
      </div>

      {/* Insert Link Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-xl p-4 w-full max-w-sm shadow-xl space-y-3 animate-in fade-in">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5 text-primary" />
              <span>Insert Web Hyperlink</span>
            </h4>
            <form onSubmit={handleApplyLink} className="space-y-2.5 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-foreground text-[11px]">Link URL *</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or /curriculum/..."
                  required
                  autoFocus
                  className="w-full h-8 px-2.5 rounded-lg border border-input bg-background text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="h-7 px-3 rounded-lg border border-border text-xs hover:bg-muted font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 shadow-xs"
                >
                  Apply Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
