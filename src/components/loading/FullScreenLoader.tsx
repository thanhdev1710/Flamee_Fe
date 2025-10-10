import { Logo } from "../shared/Logo";

export default function FullScreenLoader() {
  return (
    <div className="w-full h-full bg-primary-foreground top-0 left-0 fixed z-50 flex items-center justify-center">
      <div className="animate-pulse">
        <Logo size={62} />
      </div>
    </div>
  );
}
