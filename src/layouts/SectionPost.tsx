"use client";

import PostCard from "@/components/shared/PostCard";
import useSWRInfinite from "swr/infinite";
import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import { PAGE_SIZE } from "@/global/base";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface SectionPostProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

const BUFFER = 5; // Số lượng item để giữ thêm mỗi phía

export default function SectionPost({ scrollRef }: SectionPostProps) {
  const { width } = useWindowSize();
  const itemHeight = width < 700 ? width : 640;

  const { data, setSize, isValidating, error } = useSWRInfinite(
    (pageIndex, previousPageData: Post[] | null) => {
      if (previousPageData && previousPageData.length < PAGE_SIZE) return null;
      const start = pageIndex * PAGE_SIZE;
      return `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${PAGE_SIZE}`;
    },
    (url) => fetch(url).then((res) => res.json())
  );

  const posts = data ? data.flat() : [];
  const hasMore = data ? data[data.length - 1]?.length === PAGE_SIZE : true;

  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  // Handle scroll để cập nhật range hiển thị
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      const firstVisibleIndex = Math.floor(scrollTop / itemHeight);
      const visibleCount = Math.ceil(containerHeight / itemHeight);

      const start = Math.max(0, firstVisibleIndex - BUFFER);
      const end = firstVisibleIndex + visibleCount + BUFFER;

      setVisibleRange({ start, end });

      if (end >= posts.length - 5 && hasMore && !isValidating) {
        setSize((s) => s + 1);
      }
    };

    container.addEventListener("scroll", onScroll);
    onScroll(); // initial

    return () => container.removeEventListener("scroll", onScroll);
  }, [scrollRef, posts.length, itemHeight, hasMore, isValidating, setSize]);

  if (error) {
    return (
      <div className="text-center text-red-600">
        Lỗi tải dữ liệu: {error.message}
      </div>
    );
  }

  return (
    <div
      style={{
        height: posts.length * itemHeight,
        position: "relative",
      }}
    >
      {posts.map((post, index) => {
        if (index < visibleRange.start || index > visibleRange.end) return null;

        return (
          <div
            key={post.id}
            style={{
              position: "absolute",
              top: index * itemHeight,
              left: 0,
              width: "100%",
              height: itemHeight,
              padding: "1rem 0 1rem 0",
            }}
          >
            <PostCard {...post} />
          </div>
        );
      })}
    </div>
  );
}
