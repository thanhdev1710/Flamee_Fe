"use client";

import { toast } from "sonner";
import { checkPostContent } from "./post.action";

export async function handleToxicCheck(
  content: string,
  title?: string
): Promise<boolean> {
  const check = await checkPostContent((title ? title + " " : "") + content);

  // ❌ Trường hợp lỗi backend
  if (typeof check === "string") {
    toast.error("Không kiểm duyệt được bài viết: " + check, {
      richColors: true,
    });
    return false;
  }

  if (!check) return false;

  const isToxic = check.label?.toLowerCase() === "toxic";

  // ❌ Bài viết độc hại → hiển thị toast + dừng lại
  if (isToxic) {
    // chọn màu theo mức độ độc hại
    const color =
      check.severity === "high"
        ? "red"
        : check.severity === "medium"
        ? "orange"
        : "yellow";

    const colorClasses = {
      red: {
        bg: "bg-red-600/10",
        border: "border-red-600/30",
        text: "text-red-200",
        badge: "bg-red-600/20 text-red-400",
      },
      orange: {
        bg: "bg-orange-600/10",
        border: "border-orange-600/30",
        text: "text-orange-200",
        badge: "bg-orange-600/20 text-orange-400",
      },
      yellow: {
        bg: "bg-yellow-600/10",
        border: "border-yellow-600/30",
        text: "text-yellow-200",
        badge: "bg-yellow-600/20 text-yellow-500",
      },
    }[color];

    toast.error(
      <div className="flex flex-col gap-3 w-full max-w-[360px]">
        {/* TIÊU ĐỀ */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${colorClasses.badge}`}>⚠️</div>

          <div className="font-semibold text-base">
            Nội dung độc hại được phát hiện!
          </div>
        </div>

        {/* MỨC ĐỘ */}
        <div className="text-sm opacity-80">
          Mức độ:{" "}
          <span className="font-semibold uppercase">{check.severity}</span>
        </div>

        {/* ĐỘ TỰ TIN */}
        <div className="text-sm opacity-80">
          Độ tự tin hệ thống:{" "}
          <span className="font-bold">{check.confidence}%</span>
        </div>

        {/* VÙNG HIGHLIGHT */}
        <div
          className={`p-3 rounded-lg ${colorClasses.bg} ${colorClasses.border} border text-sm leading-relaxed`}
          dangerouslySetInnerHTML={{ __html: check.highlighted_text }}
        />

        {/* THÔNG ĐIỆP */}
        <div className="text-sm opacity-90">{check.message}</div>
      </div>,
      {
        richColors: true,
        duration: 9000,
        style: {
          background: "rgba(0,0,0,0.85)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        },
      }
    );

    return false;
  }

  // ✔ Không độc hại
  return true;
}
