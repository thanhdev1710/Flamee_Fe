import { Button } from "@/components/ui/button";

function SocialMedia() {
  return (
    <section className="flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Manage Social Media
          <span className="block text-primary">Accounts</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          A new social platform that helps you share moments, connect with
          friends, and explore the world in a whole new way.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="px-8">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            Contact Us
          </Button>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <img
            src="./assets/landing-page.webp"
            alt="Social Media UI"
            className="w-full rounded-2xl shadow-2xl"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/20 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

export default SocialMedia;
