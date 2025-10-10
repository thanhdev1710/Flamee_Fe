"use client";
import { useCallback, useRef, useState, useEffect } from "react";
import type React from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Quote,
  Palette,
  MoreHorizontal,
  AtSign,
} from "lucide-react";

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSearchUsers?: (query: string) => Promise<User[]> | User[];
}

const TEXT_COLORS = [
  "#000000",
  "#374151",
  "#6B7280",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "What's on your mind?",
  className,
  onSearchUsers,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Simplified states
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [linkDialog, setLinkDialog] = useState({ open: false, url: "" });

  // Mention states - simplified
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionUsers, setMentionUsers] = useState<User[]>([]);
  const [mentionPos, setMentionPos] = useState({ top: 0, left: 0 });
  const mentionRange = useRef<Range | null>(null);

  const updateFormat = useCallback(() => {
    setBold(document.queryCommandState("bold"));
    setItalic(document.queryCommandState("italic"));
    setUnderline(document.queryCommandState("underline"));
  }, []);

  const execCommand = useCallback(
    (cmd: string, val?: string) => {
      document.execCommand(cmd, false, val);
      editorRef.current?.focus();
      updateFormat();
    },
    [updateFormat]
  );

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
    updateFormat();
  }, [onChange, updateFormat]);

  const getCaretPos = useCallback(() => {
    const sel = window.getSelection();
    if (!sel?.rangeCount || !editorRef.current) return null;

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();

    return {
      top: rect.bottom - editorRect.top + 5,
      left: rect.left - editorRect.left,
    };
  }, []);

  const searchUsers = useCallback(
    async (query: string) => {
      if (!onSearchUsers) return;
      try {
        const results = await onSearchUsers(query);
        setMentionUsers(Array.isArray(results) ? results : []);
      } catch {
        setMentionUsers([]);
      }
    },
    [onSearchUsers]
  );

  const insertMention = useCallback(
    (user: User) => {
      if (!mentionRange.current || !editorRef.current) return;

      const sel = window.getSelection();
      if (!sel) return;

      sel.removeAllRanges();
      sel.addRange(mentionRange.current);

      // Create mention element
      const mention = document.createElement("span");
      mention.contentEditable = "false";
      mention.className = "mention";
      mention.style.cssText = `
      background-color: #dbeafe;
      color: #1d4ed8;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 500;
      margin: 0 2px;
      display: inline-block;
      font-size: 0.875em;
    `;
      mention.setAttribute("data-user-id", user.id);
      mention.textContent = `@${user.username}`;

      // Replace @ and query with mention
      mentionRange.current.deleteContents();
      mentionRange.current.insertNode(mention);

      // Add space after
      const space = document.createTextNode(" ");
      mentionRange.current.setStartAfter(mention);
      mentionRange.current.insertNode(space);
      mentionRange.current.setStartAfter(space);
      mentionRange.current.setEndAfter(space);

      sel.removeAllRanges();
      sel.addRange(mentionRange.current);

      // Reset mention state
      setMentionOpen(false);
      setMentionQuery("");
      setMentionUsers([]);
      editorRef.current.focus();
      handleInput();
    },
    [handleInput]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Close mentions on Escape
      if (mentionOpen && e.key === "Escape") {
        e.preventDefault();
        setMentionOpen(false);
        setMentionQuery("");
        return;
      }

      // Handle @ character
      if (e.key === "@") {
        const pos = getCaretPos();
        if (pos) {
          const sel = window.getSelection();
          if (sel?.rangeCount) {
            mentionRange.current = sel.getRangeAt(0).cloneRange();
          }

          setMentionPos(pos);
          setMentionOpen(true);
          setMentionQuery("");
          searchUsers("");
        }
      }
    },
    [mentionOpen, getCaretPos, searchUsers]
  );

  const handleInputChange = useCallback(() => {
    handleInput();

    // Handle mention search
    if (mentionOpen) {
      const sel = window.getSelection();
      if (!sel?.rangeCount) return;

      const range = sel.getRangeAt(0);
      const textNode = range.startContainer;

      if (textNode.nodeType === Node.TEXT_NODE) {
        const text = textNode.textContent || "";
        const cursorPos = range.startOffset;
        const beforeCursor = text.substring(0, cursorPos);
        const atIndex = beforeCursor.lastIndexOf("@");

        if (atIndex !== -1) {
          const query = beforeCursor.substring(atIndex + 1);
          setMentionQuery(query);
          searchUsers(query);

          // Update range to include @ and query
          if (mentionRange.current) {
            mentionRange.current.setStart(textNode, atIndex);
            mentionRange.current.setEnd(textNode, cursorPos);
          }
        } else {
          setMentionOpen(false);
          setMentionQuery("");
        }
      }
    }
  }, [handleInput, mentionOpen, searchUsers]);

  const insertQuote = useCallback(() => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;

    const range = sel.getRangeAt(0);
    const selectedText = range.toString();

    const quote = document.createElement("blockquote");
    quote.style.cssText = `
      border-left: 4px solid #3b82f6;
      padding-left: 16px;
      margin: 8px 0;
      font-style: italic;
      color: #6b7280;
    `;
    quote.textContent = selectedText || "Quote text here...";

    range.deleteContents();
    range.insertNode(quote);
    range.setStartAfter(quote);
    range.setEndAfter(quote);
    sel.removeAllRanges();
    sel.addRange(range);

    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden shadow-sm relative",
        className
      )}
    >
      {/* Desktop Toolbar */}
      <div className="hidden md:flex items-center gap-1 p-3 border-b rounded-t-lg">
        <div className="flex items-center gap-1">
          <Toggle
            pressed={bold}
            onPressedChange={() => execCommand("bold")}
            size="sm"
          >
            <Bold className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={italic}
            onPressedChange={() => execCommand("italic")}
            size="sm"
          >
            <Italic className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={underline}
            onPressedChange={() => execCommand("underline")}
            size="sm"
          >
            <Underline className="w-4 h-4" />
          </Toggle>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <p className="text-sm font-medium">Text Color</p>
              <div className="grid grid-cols-5 gap-2">
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => execCommand("foreColor", color)}
                    className="w-8 h-8 rounded border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand("insertUnorderedList")}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand("insertOrderedList")}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={insertQuote}>
            <Quote className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLinkDialog({ open: true, url: "" })}
        >
          <Link className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1 text-xs">
          <AtSign className="w-3 h-3" />
          <span>Type @ to mention</span>
        </div>
      </div>

      {/* Mobile Toolbar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-2 border-b rounded-t-lg">
          <div className="flex items-center gap-1">
            <Toggle
              pressed={bold}
              onPressedChange={() => execCommand("bold")}
              size="sm"
            >
              <Bold className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={italic}
              onPressedChange={() => execCommand("italic")}
              size="sm"
            >
              <Italic className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={underline}
              onPressedChange={() => execCommand("underline")}
              size="sm"
            >
              <Underline className="w-4 h-4" />
            </Toggle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {showMobileMenu && (
          <div className="p-3 border-b space-y-3">
            <div className="flex flex-wrap gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand("insertUnorderedList")}
              >
                <List className="w-4 h-4 mr-1" />
                List
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand("insertOrderedList")}
              >
                <ListOrdered className="w-4 h-4 mr-1" />
                Numbers
              </Button>
              <Button variant="ghost" size="sm" onClick={insertQuote}>
                <Quote className="w-4 h-4 mr-1" />
                Quote
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLinkDialog({ open: true, url: "" })}
              >
                <Link className="w-4 h-4 mr-1" />
                Link
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium">Text Colors</p>
              <div className="grid grid-cols-5 gap-1">
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => execCommand("foreColor", color)}
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <AtSign className="w-3 h-3" />
              <span>Type @ to mention users</span>
            </div>
          </div>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInputChange}
        onKeyDown={handleKeyDown}
        onMouseUp={updateFormat}
        className="prose prose-sm max-w-none min-h-[120px] break-words rounded-b-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset prose-a:text-blue-500 prose-a:underline"
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
        style={{ color: "inherit" }}
      />

      {/* Mention Dropdown */}
      {mentionOpen && (
        <div
          className="absolute z-50 border rounded-lg shadow-lg w-64 max-h-48 overflow-hidden bg-foreground text-background"
          style={{ top: mentionPos.top, left: mentionPos.left }}
        >
          <div className="p-2 border-b text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AtSign className="w-3 h-3" />
              <span>Mention someone</span>
            </div>
            {mentionQuery && (
              <div className="text-blue-600 font-mono">@{mentionQuery}</div>
            )}
          </div>

          <ScrollArea className="max-h-40">
            {mentionUsers.length > 0 ? (
              <div className="p-1">
                {mentionUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => insertMention(user)}
                    className="w-full flex items-center gap-2 p-2 rounded text-left transition-colors"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.displayName}
                        className="w-6 h-6 rounded-full flex-shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.displayName}
                      </p>
                      <p className="text-xs truncate">@{user.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-sm">
                {mentionQuery ? (
                  <div>
                    <div className="mb-1">No users found for:</div>
                    <div className="font-mono text-blue-600">
                      @{mentionQuery}
                    </div>
                  </div>
                ) : (
                  "Start typing to search users"
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {/* Link Dialog */}
      <AlertDialog
        open={linkDialog.open}
        onOpenChange={(open) => setLinkDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Insert Link</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the URL you want to link to:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="url"
            value={linkDialog.url}
            onChange={(e) =>
              setLinkDialog((prev) => ({ ...prev, url: e.target.value }))
            }
            placeholder="https://example.com"
            className="mt-2"
          />
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setLinkDialog({ open: false, url: "" })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (linkDialog.url) {
                  const url = linkDialog.url.startsWith("http")
                    ? linkDialog.url
                    : `https://${linkDialog.url}`;
                  execCommand("createLink", url);
                }
                setLinkDialog({ open: false, url: "" });
              }}
            >
              Insert Link
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
