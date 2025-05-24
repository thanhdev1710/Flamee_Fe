"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import FeatureBox from "./FeatureBox";

function SocialControl() {
  const [features] = useState([
    {
      name: "Image",
      image: "https://cdn-icons-png.flaticon.com/128/9261/9261181.png",
      description:
        "Upload photos, capture memories, and express your unique style through every image.",
    },
    {
      name: "Follower",
      image: "https://cdn-icons-png.flaticon.com/128/7542/7542074.png",
      description:
        "Follow friends, influencers, or communities you love and stay updated on what's important to you.",
    },
    {
      name: "Post",
      image: "https://cdn-icons-png.flaticon.com/128/16025/16025454.png",
      description:
        "Share your thoughts, updates, or stories in your own voice and connect with your audience.",
    },
    {
      name: "Activities",
      image: "https://cdn-icons-png.flaticon.com/128/9768/9768886.png",
      description:
        "Take part in challenges, events, and community activities to engage and explore more.",
    },
    {
      name: "Social",
      image: "https://cdn-icons-png.flaticon.com/128/1925/1925274.png",
      description:
        "Interact, share, and create a social space that reflects your personality and interests.",
    },
    {
      name: "Comment",
      image: "https://cdn-icons-png.flaticon.com/128/5755/5755460.png",
      description:
        "Comment, reply, and share your views to build genuine connections with others.",
    },
  ]);

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-6">
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-600 hover:bg-orange-100"
          >
            Social Control
          </Badge>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            You Are In All Control
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Take charge of your social experience. Share moments, build your
            community, and connect with the world—your way.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <FeatureBox
              key={feature.name}
              name={feature.name}
              image={feature.image}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SocialControl;
