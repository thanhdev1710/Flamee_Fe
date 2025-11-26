import { cn } from "@/lib/utils";

export function SkeletonMessage() {
  return (
    <div className="flex gap-3 mb-4 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-slate-800" />
      <div className="flex-1">
        <div className="h-3 bg-slate-800 rounded w-24 mb-2" />
        <div className="h-16 bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonConversation() {
  return (
    <div className="flex gap-3 p-3 rounded-xl animate-pulse">
      <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-slate-800 rounded w-32 mb-2" />
        <div className="h-3 bg-slate-800 rounded w-full" />
      </div>
    </div>
  );
}

export function SkeletonMember() {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg animate-pulse">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-8 h-8 rounded-full bg-slate-800" />
        <div className="flex-1">
          <div className="h-3 bg-slate-800 rounded w-24 mb-1" />
          <div className="h-2 bg-slate-800 rounded w-16" />
        </div>
      </div>
      <div className="w-8 h-8 bg-slate-800 rounded" />
    </div>
  );
}

export function SkeletonMembersPanel() {
  return (
    <div className="space-y-1">
      <SkeletonMember />
      <SkeletonMember />
      <SkeletonMember />
      <SkeletonMember />
    </div>
  );
}

interface PulseLoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function PulseLoading({ size = "md", text }: PulseLoadingProps) {
  const sizeClass = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }[size];

  const gapClass = {
    sm: "gap-0.5",
    md: "gap-1",
    lg: "gap-1.5",
  }[size];

  return (
    <div className="flex items-center justify-center gap-2">
      <div className={cn("flex items-center", gapClass)}>
        <div
          className={cn(sizeClass, "rounded-full bg-blue-500 animate-bounce")}
        />
        <div
          className={cn(
            sizeClass,
            "rounded-full bg-blue-500 animate-bounce",
            "[animation-delay:150ms]"
          )}
        />
        <div
          className={cn(
            sizeClass,
            "rounded-full bg-blue-500 animate-bounce",
            "[animation-delay:300ms]"
          )}
        />
      </div>
      {text && <span className="text-xs text-slate-400">{text}</span>}
    </div>
  );
}
