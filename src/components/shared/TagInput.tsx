import { Badge } from "../ui/badge";
import { Hash, X } from "lucide-react";
import { Input } from "../ui/input";
import { type ChangeEvent, useState, type KeyboardEvent } from "react";

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  disabled?: boolean;
}

export default function TagInput({
  tags,
  onAddTag,
  onRemoveTag,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        onAddTag(inputValue);
        setInputValue("");
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Prevent spaces at the beginning and limit length
    if (value.length <= 20) {
      setInputValue(value);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border rounded-lg">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-sm"
          >
            <Hash className="w-3 h-3" />
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              disabled={disabled}
              className="ml-1 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={
            tags.length === 0
              ? "Type a tag and press Enter..."
              : "Add another tag..."
          }
          disabled={disabled || tags.length >= 10}
          className="border-none shadow-none focus-visible:ring-0 flex-1 min-w-[120px] h-auto px-3 py-2"
        />
      </div>
      <div className="flex justify-between text-xs">
        <span>{tags.length}/10 tags</span>
        <span>{inputValue.length}/20 characters</span>
      </div>
    </div>
  );
}
