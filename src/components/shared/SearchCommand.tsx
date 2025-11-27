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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useDebounceValue(query, 300);
  const router = useRouter();

  // ⌘ + J shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // SWR fetch
  const {
    data: postsData,
    error: errPosts,
    isLoading: loadingPosts,
  } = useSWR(["posts", search], () => searchPost({ q: search, limit: 5 }));
  const {
    data: usersData,
    error: errUsers,
    isLoading: loadingUsers,
  } = useSWR(["users", search], () => searchUsername("@" + search));

  const posts: Post[] = postsData && !errPosts ? postsData : [];
  const users: SearchUsername[] = usersData && !errUsers ? usersData : [];
  const loading = loadingPosts || loadingUsers;

  // Handle Enter
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
        <Input
          disabled
          placeholder="Search users, posts, hashtags..."
          className="pl-10 border shadow placeholder:text-foreground"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
          Press{" "}
          <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono border select-none shadow">
            ⌘ J
          </kbd>
        </div>
      </div>

      {/* Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <div className="relative">
            <CommandInput
              value={query}
              onValueChange={(q) => {
                setQuery(q);
                setSearch(q);
              }}
              onKeyDown={handleEnter}
              placeholder="Search users, posts, hashtags..."
              className="placeholder:text-sm pr-8"
            />
          </div>

          <ScrollArea className="max-h-80 mt-1">
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

              {loading ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* Users */}
                  {users.length > 0 && (
                    <CommandGroup heading="People">
                      {users.map((user) => (
                        <CommandItem
                          key={user.user_id}
                          onSelect={() => {
                            router.push(`/app/users/${user.username}`);
                            setOpen(false);
                          }}
                        >
                          <User className="mr-2 h-4 w-4 text-blue-500" />
                          <span>{user.username}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {/* Posts */}
                  {posts.length > 0 && (
                    <CommandGroup heading="Posts">
                      {posts.map((post) => (
                        <CommandItem
                          key={post.id}
                          onSelect={() => {
                            router.push(`/app/feeds/${post.id}`);
                            setOpen(false);
                          }}
                        >
                          <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
                          <span>{post.title}</span>
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
