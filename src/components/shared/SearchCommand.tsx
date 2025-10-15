"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, User, MessageCircle, Hash } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "../ui/input";

// Dummy data
const people = [{ name: "ChiThanh1710" }, { name: "JaneDoe" }];
const posts = [
  { title: "How to build a profile page", slug: "how-to-build-a-profile-page" },
  { title: "Tips for UI design", slug: "tips-for-ui-design" },
];
const hashtags = ["NextJS", "UIUX"];

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  // ⌘ + J shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Handle Enter for raw search
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      router.push(`/search/${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Trigger Box */}
      <div
        onClick={() => setOpen(true)}
        className="relative w-full cursor-text"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          disabled
          placeholder="Search users, posts, hashtags..."
          className="pl-10 border-none bg-muted/30"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
          Press{" "}
          <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono border select-none shadow">
            ⌘ J
          </kbd>
        </div>
      </div>

      {/* Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            onKeyDown={handleEnter}
            placeholder="Search users, posts, hashtags..."
            className="placeholder:text-sm"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {/* General Search */}
            {query.trim() && (
              <CommandItem
                onSelect={() => {
                  router.push(`/search/${encodeURIComponent(query.trim())}`);
                  setOpen(false);
                }}
              >
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Search for “{query.trim()}”</span>
              </CommandItem>
            )}

            {/* People */}
            {people.length > 0 && (
              <CommandGroup heading="People">
                {people.map((person) => (
                  <CommandItem
                    key={person.name}
                    onSelect={() => {
                      router.push(`/users/${person.name}`);
                      setOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4 text-blue-500" />
                    <span>{person.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Posts */}
            {posts.length > 0 && (
              <CommandGroup heading="Posts">
                {posts.map((post) => (
                  <CommandItem
                    key={post.slug}
                    onSelect={() => {
                      router.push(`/app/feeds/${post.slug}`);
                      setOpen(false);
                    }}
                  >
                    <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>{post.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Hashtags */}
            {hashtags.length > 0 && (
              <CommandGroup heading="Hashtags">
                {hashtags.map((tag) => (
                  <CommandItem
                    key={tag}
                    onSelect={() => {
                      router.push(`/search?tag=${encodeURIComponent(tag)}`);
                      setOpen(false);
                    }}
                  >
                    <Hash className="mr-2 h-4 w-4 text-purple-500" />
                    <span>#{tag}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
