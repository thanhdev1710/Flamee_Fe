"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "What's on your mind?",
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [formatState, setFormatState] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    alignLeft: true,
    alignCenter: false,
    alignRight: false,
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const updateFormatState = useCallback(() => {
    setFormatState({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      alignLeft: document.queryCommandState("justifyLeft"),
      alignCenter: document.queryCommandState("justifyCenter"),
      alignRight: document.queryCommandState("justifyRight"),
    });
  }, []);

  const executeCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
      updateFormatState();
    },
    [updateFormatState]
  );

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
    updateFormatState();
  }, [onChange, updateFormatState]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Handle keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault();
            executeCommand("bold");
            break;
          case "i":
            e.preventDefault();
            executeCommand("italic");
            break;
          case "u":
            e.preventDefault();
            executeCommand("underline");
            break;
        }
      }
    },
    [executeCommand]
  );

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  }, [executeCommand]);

  const formatHeading = useCallback(
    (level: string) => {
      executeCommand("formatBlock", level);
      setShowMobileMenu(false);
    },
    [executeCommand]
  );

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Desktop Toolbar
  const DesktopToolbar = () => (
    <div className="hidden md:flex items-center gap-1 p-2 border-b rounded-t-lg">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Toggle
          pressed={formatState.bold}
          onPressedChange={() => executeCommand("bold")}
          size="sm"
          aria-label="Bold"
        >
          <Bold className="w-4 h-4" />
        </Toggle>
        <Toggle
          pressed={formatState.italic}
          onPressedChange={() => executeCommand("italic")}
          size="sm"
          aria-label="Italic"
        >
          <Italic className="w-4 h-4" />
        </Toggle>
        <Toggle
          pressed={formatState.underline}
          onPressedChange={() => executeCommand("underline")}
          size="sm"
          aria-label="Underline"
        >
          <Underline className="w-4 h-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Headings */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Type className="w-4 h-4 mr-1" />
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => formatHeading("div")}>
            Normal Text
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading("h1")}>
            <span className="text-2xl font-bold">Heading 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading("h2")}>
            <span className="text-xl font-bold">Heading 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading("h3")}>
            <span className="text-lg font-bold">Heading 3</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("insertUnorderedList")}
          aria-label="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("insertOrderedList")}
          aria-label="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <Toggle
          pressed={formatState.alignLeft}
          onPressedChange={() => executeCommand("justifyLeft")}
          size="sm"
          aria-label="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </Toggle>
        <Toggle
          pressed={formatState.alignCenter}
          onPressedChange={() => executeCommand("justifyCenter")}
          size="sm"
          aria-label="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </Toggle>
        <Toggle
          pressed={formatState.alignRight}
          onPressedChange={() => executeCommand("justifyRight")}
          size="sm"
          aria-label="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Link */}
      <Button
        variant="ghost"
        size="sm"
        onClick={insertLink}
        aria-label="Insert Link"
      >
        <Link className="w-4 h-4" />
      </Button>
    </div>
  );

  // Mobile Toolbar
  const MobileToolbar = () => (
    <div className="md:hidden">
      {/* Main toolbar */}
      <div className="flex items-center justify-between p-2 border-b rounded-t-lg">
        <div className="flex items-center gap-1">
          <Toggle
            pressed={formatState.bold}
            onPressedChange={() => executeCommand("bold")}
            size="sm"
            aria-label="Bold"
          >
            <Bold className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={formatState.italic}
            onPressedChange={() => executeCommand("italic")}
            size="sm"
            aria-label="Italic"
          >
            <Italic className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={formatState.underline}
            onPressedChange={() => executeCommand("underline")}
            size="sm"
            aria-label="Underline"
          >
            <Underline className="w-4 h-4" />
          </Toggle>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Expandable menu */}
      {showMobileMenu && (
        <div className="p-2 border-b space-y-2">
          {/* Headings */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatHeading("h1")}
            >
              H1
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatHeading("h2")}
            >
              H2
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatHeading("h3")}
            >
              H3
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatHeading("div")}
            >
              Normal
            </Button>
          </div>

          {/* Lists and Alignment */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand("insertUnorderedList")}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand("insertOrderedList")}
            >
              <ListOrdered className="w-4 h-4 mr-1" />
              Numbers
            </Button>
            <Button variant="ghost" size="sm" onClick={insertLink}>
              <Link className="w-4 h-4 mr-1" />
              Link
            </Button>
          </div>

          {/* Alignment */}
          <div className="flex gap-1">
            <Toggle
              pressed={formatState.alignLeft}
              onPressedChange={() => executeCommand("justifyLeft")}
              size="sm"
            >
              <AlignLeft className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={formatState.alignCenter}
              onPressedChange={() => executeCommand("justifyCenter")}
              size="sm"
            >
              <AlignCenter className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={formatState.alignRight}
              onPressedChange={() => executeCommand("justifyRight")}
              size="sm"
            >
              <AlignRight className="w-4 h-4" />
            </Toggle>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <DesktopToolbar />
      <MobileToolbar />

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={updateFormatState}
        onKeyUp={updateFormatState}
        className="min-h-[120px] rounded-b-lg p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset prose prose-sm max-w-none"
        style={{ wordBreak: "break-word" }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }

        [contenteditable] h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }

        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }

        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }

        [contenteditable] ul,
        [contenteditable] ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }

        [contenteditable] p {
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}
