"use client";

import { useCallback, useRef, useState, useEffect } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
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
  const savedSelectionRef = useRef<Range | null>(null);
  const [formatState, setFormatState] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    alignLeft: true,
    alignCenter: false,
    alignRight: false,
  });

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

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
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0);
    }
    setLinkUrl("");
    setIsLinkDialogOpen(true);
  }, []);

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

  const DesktopToolbar = () => (
    <div className="hidden md:flex items-center gap-1 p-2 border-b rounded-t-lg">
      <div className="flex items-center gap-1">
        <Toggle
          pressed={formatState.bold}
          onPressedChange={() => executeCommand("bold")}
          size="sm"
        >
          <Bold className="w-4 h-4" />
        </Toggle>
        <Toggle
          pressed={formatState.italic}
          onPressedChange={() => executeCommand("italic")}
          size="sm"
        >
          <Italic className="w-4 h-4" />
        </Toggle>
        <Toggle
          pressed={formatState.underline}
          onPressedChange={() => executeCommand("underline")}
          size="sm"
        >
          <Underline className="w-4 h-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6!" />

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

      <Separator orientation="vertical" className="h-6!" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("insertUnorderedList")}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("insertOrderedList")}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6!" />

      <div className="flex items-center gap-1">
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

      <Separator orientation="vertical" className="h-6!" />

      <Button variant="ghost" size="sm" onClick={insertLink}>
        <Link className="w-4 h-4" />
      </Button>
    </div>
  );

  const MobileToolbar = () => (
    <div className="md:hidden">
      <div className="flex items-center justify-between p-2 border-b rounded-t-lg">
        <div className="flex items-center gap-1">
          <Toggle
            pressed={formatState.bold}
            onPressedChange={() => executeCommand("bold")}
            size="sm"
          >
            <Bold className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={formatState.italic}
            onPressedChange={() => executeCommand("italic")}
            size="sm"
          >
            <Italic className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={formatState.underline}
            onPressedChange={() => executeCommand("underline")}
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
        <div className="p-2 border-b space-y-2">
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
        className="prose prose-sm max-w-none min-h-[120px] break-words rounded-b-lg p-4 *:text-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset prose-a:text-blue-500 prose-a:underline"
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* AlertDialog for Link Insertion */}
      <AlertDialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Insert Link</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the URL to link to:
            </AlertDialogDescription>
          </AlertDialogHeader>

          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full border rounded px-3 py-2 mt-2 text-sm"
          />

          <AlertDialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (linkUrl && savedSelectionRef.current) {
                  const selection = window.getSelection();
                  selection?.removeAllRanges();
                  selection?.addRange(savedSelectionRef.current);

                  const normalizedUrl = linkUrl.startsWith("http")
                    ? linkUrl
                    : `https://${linkUrl}`;

                  executeCommand("createLink", normalizedUrl);
                }
                setIsLinkDialogOpen(false);
              }}
            >
              Insert
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
