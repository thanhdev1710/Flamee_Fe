"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import CommentBox, { CommentData } from "./CommentBox";

const CommentSection = () => {
  const [features] = useState<CommentData[]>([
    {
      rate: "Flamee has totally changed how I stay in touch with my friends. It's easy to use and looks amazing!",
      username: "Donald Simpson",
      auth: "Customer",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFG4OocuEX03pMnQeBP0cfOu852b1coiCAzQjvsvawtW2qDvB0wKC3IYI74EnH1mULIp8&usqp=CAU",
    },
    {
      rate: "I love the features! Posting updates and interacting with others feels fun and meaningful.",
      username: "Alex Johnson",
      auth: "Customer",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgiyxiB8HbFWU2XmAT-6ProtT6R1QRE7HZQg&s",
    },
    {
      rate: "Flamee feels like home. I've met great friends here and always find something inspiring. I love Flamee!",
      username: "Lili Garcia",
      auth: "Customer",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8E7IL-sjhTaZ3pHzHDRfurKiNuD_bTYBj8Q&s",
    },
  ]);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge
            variant="secondary"
            className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100"
          >
            Comments
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight">User Comments</h2>
          <p className="mt-2 text-muted-foreground">
            What our users say about Flamee
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-8">
          {features.map((feature, index) => (
            <CommentBox data={feature} key={index} />
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30"></div>
          <div className="h-2 w-2 rounded-full bg-primary"></div>
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30"></div>
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
