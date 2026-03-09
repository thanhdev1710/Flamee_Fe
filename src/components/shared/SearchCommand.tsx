"use client";

import { useRouter } from "next/navigation";
import { Search, User, MessageCircle } from "lucide-react";
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
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import useSWR from "swr";
import { searchPost } from "@/services/post.service";
import { searchUsername } from "@/services/user.service";
import { Post } from "@/types/post.type";
import { SearchUsername } from "@/types/user.type";
import { ScrollArea } from "../ui/scroll-area";

export function SearchCommand() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [search] = useDebounceValue(query, 350);

  // ==========================
  //  Cmd + J Shortcut
  // ==========================
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // ==========================
  //  SWR SEARCH USERS & POSTS
  // ==========================
  const shouldSearch = search.trim().length > 0;

  const { data: usersData, isLoading: loadingUsers } = useSWR(
    shouldSearch ? ["search-users", search] : null,
    () => searchUsername("@" + search)
  );

  const { data: postsData, isLoading: loadingPosts } = useSWR(
    shouldSearch ? ["search-posts", search] : null,
    () => searchPost({ q: search, limit: 5 })
  );

  const posts: Post[] = postsData?.items || [];

  const users: SearchUsername[] = usersData || [];

  const isLoading = loadingUsers || loadingPosts;

  // ==========================
  //  Handle Press Enter
  // ==========================
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search/${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  // ==========================
  //  UI
  // ==========================
  return (
    <>
      {/* SEARCH BAR (Trigger) */}
      <div onClick={() => setOpen(true)} className="relative cursor-text">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
        <Input
          disabled
          placeholder="Search users, posts, hashtags..."
          className="pl-10 pr-16 border shadow-sm cursor-pointer"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-70">
          <kbd className="bg-muted px-1 py-0.5 rounded border text-[10px]">
            ⌘ J
          </kbd>
        </div>
      </div>

      {/* COMMAND MODAL */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          {/* INPUT */}
          <CommandInput
            value={query}
            onValueChange={setQuery}
            onKeyDown={handleEnter}
            placeholder="Search users, posts, hashtags..."
            className="placeholder:text-sm"
          />

          {/* RESULT LIST */}
          <ScrollArea className="max-h-80">
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              {/* Direct Search */}
              {query.trim() && (
                <CommandItem
                  className="py-2"
                  onSelect={() => {
                    router.push(`/search/${encodeURIComponent(query.trim())}`);
                    setOpen(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                  Search for “{query.trim()}”
                </CommandItem>
              )}

              {/* LOADING SKELETON */}
              {isLoading && (
                <div className="px-4 py-3 space-y-2">
                  <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-52 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </div>
              )}

              {!isLoading && (
                <>
                  {/* USERS */}
                  {users.length > 0 && (
                    <CommandGroup heading="Users">
                      {users.map((u) => (
                        <CommandItem
                          key={u.user_id}
                          onSelect={() => {
                            router.push(`/app/users/${u.username}`);
                            setOpen(false);
                          }}
                          className="py-2"
                        >
                          <User className="mr-2 h-4 w-4 text-blue-500" />
                          <span>{u.username}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {/* POSTS */}
                  {posts.length > 0 && (
                    <CommandGroup heading="Posts">
                      {posts.map((p) => (
                        <CommandItem
                          key={p.id}
                          onSelect={() => {
                            router.push(`/app/feeds/${p.id}`);
                            setOpen(false);
                          }}
                          className="py-2"
                        >
                          <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
                          <span>{p.title || "Untitled Post"}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </ScrollArea>
        </Command>
      </CommandDialog>
    </>
  );
}
