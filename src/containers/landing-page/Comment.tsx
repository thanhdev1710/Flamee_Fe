"use client";
import { useState } from "react";
import CommentBox from "./CommentBox";

export interface CommentData {
  rate: string;
  username: string;
  auth: string;
  image: string;
}

const CommentSection = () => {
  const [features] = useState<CommentData[]>([
    {
      rate: "Flamee has totally changed how I stay in touch with my friends. It's easy to use and looks amazing!",
      username: "Donald Simpson",
      auth: "Customer",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFG4OocuEX03pMnQeBP0cfOu852b1coiCAzQjvsvawtW2qDvB0wKC3IYI74EnH1mULIp8&usqp=CAU"
    },
    {
      rate: "I love the features! Posting updates and interacting with others feels fun and meaningful.",
      username: "Alex Johnson",
      auth: "Customer",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgiyxiB8HbFWU2XmAT-6ProtT6R1QRE7HZQg&s"
    },
    {
      rate: "Flamee feels like home. I’ve met great friends here and always find something inspiring.I love Flamee!",
      username: "Lili Garcia ",
      auth: "Customer",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8E7IL-sjhTaZ3pHzHDRfurKiNuD_bTYBj8Q&s"
    },
  ]);

  return (
    <section className="bg-gray-100 py-16">
      <div className="text-center mb-10">
        <button className="bg-orange-100 text-orange-600 text-sm font-medium px-8 py-3 rounded-md mb-2">
          Comment
        </button>
        <h2 className="text-3xl font-bold text-gray-800">User Comments</h2>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-4">
          {features.map((feature, index) => (
            <CommentBox data={feature} key={index} />
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex gap-2 mt-6">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
