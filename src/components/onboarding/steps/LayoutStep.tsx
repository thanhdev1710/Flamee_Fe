"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export default function LayoutStep({
  children,
  onClickNext,
  onClickPrev,
  isNext = true,
  isPrev = true,
  isFinish = false,
}: {
  children: React.ReactNode;
  onClickNext: () => void;
  onClickPrev?: () => void;
  isNext?: boolean;
  isPrev?: boolean;
  isFinish?: boolean;
}) {
  return (
    <section className="flex flex-col justify-between h-full w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex-grow">{children}</div>

      <div className="flex justify-between items-center mt-6">
        {isPrev ? (
          <button
            onClick={onClickPrev}
            className="flex items-center gap-2 px-4 py-2 rounded-lg opacity-60 bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </button>
        ) : (
          <div />
        )}

        {isNext && (
          <button
            onClick={onClickNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-flamee-primary text-white hover:bg-flamee-primary/90 transition"
          >
            {isFinish ? (
              <>
                <Check size={18} />
                <span>Hoàn thành</span>
              </>
            ) : (
              <>
                <span>Tiếp theo</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
