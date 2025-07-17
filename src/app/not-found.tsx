import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";

export const metadata = {
  title: "404 - Page Not Found | Flamee",
  description:
    "The page you are looking for does not exist. Go back to the homepage and try again.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "404 - Page Not Found | Flamee",
    description:
      "The page you are looking for does not exist. Go back to the homepage and try again.",
    type: "website",
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center text-center p-4">
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-center">
          <Logo size={64} />
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          😵‍💫 Oops! Flamee doesn’t know this page either!
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          🕳️ You&apos;ve opened a portal to nowhere... <br /> 🏡 But don’t
          worry! Flamee will take you back home.
        </p>

        <Link href="/">
          <Button className="gap-2 cursor-pointer">
            🚀 Let&apos;s go back home!
          </Button>
        </Link>
      </div>
    </div>
  );
}
