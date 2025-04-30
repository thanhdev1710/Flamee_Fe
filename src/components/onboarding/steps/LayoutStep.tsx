"use client";

export default function LayoutStep({
  children,
  onClickNext,
  onClickPrev,
  isNext = true,
  isPrev = true,
}: {
  children: React.ReactNode;
  onClickNext: () => void;
  onClickPrev?: () => void;
  isNext?: boolean;
  isPrev?: boolean;
}) {
  return (
    <section className="flex flex-col justify-between h-full w-full">
      <div>{children}</div>
      <div className="flex gap-8 justify-end mt-4">
        {isPrev && (
          <button
            onClick={onClickPrev}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Quay lại
          </button>
        )}
        {isNext && (
          <button
            onClick={onClickNext}
            className="bg-flamee-primary text-white px-4 py-2 rounded"
          >
            Tiếp theo
          </button>
        )}
      </div>
    </section>
  );
}
