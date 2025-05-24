"use client";
import { useState } from "react";
import PricingPackageBox from "./PricingPackageBox";

function Pricing() {
  const [features, setFeatures] = useState([
    {
      name: "Standard user",  
      price: "$14.90",
      unit: "month",
      features: [
        { status: "correct", name: "5 Social in a month" }, 
        { status: "correct", name: "15 Social in a day" },
        { status: "correct", name: "+1 Extra users" },
        { status: "correct", name: "3 level test" },
        { status: "correct", name: "Achievement Award" },
        { status: "uncorrect", name: "Special education set" },
      ],
      button: "Get Started",
      isActive: false,
    },
    {
      name: "Premium User",
      price: "$34.90",
      unit: "month",
      features: [
        { status: "correct", name: "10 Social in a month" },
        { status: "correct", name: "15 Social in a day" },
        { status: "correct", name: "+3 Extra users" },
        { status: "correct", name: "3 level test" },
        { status: "correct", name: "Achievement Award" },
        { status: "uncorrect", name: "Special education set" },
      ],
      button: "Get Started",
      isActive: true,
    },
    {
      name: "Premium User",
      price: "$54.90",
      unit: "month",
      features: [
        { status: "correct", name: "All Social in a month" },
        { status: "correct", name: "15 Social in a day" },
        { status: "correct", name: "+3 Extra users" },
        { status: "correct", name: "3 level test" },
        { status: "correct", name: "Achievement Award" },
        { status: "uncorrect", name: "Special education set" },
      ],
      button: "Get Started",
      isActive: false,
    },
  ]);

  return (
    <div className="py-16 bg-gray-60 text-center">
      <div className="mb-6">
        <button className="bg-orange-100 text-orange-600 px-8 py-3 rounded-md text-sm font-semibold  shadow-sm">
          Pricing
        </button>
      </div>
      <h1 className="text-3xl font-semibold mb-3">How Much Do I Have to Pay?</h1>
      <p className="max-w-xl mx-auto text-gray-500 mb-10 text-sm">
       Enjoy modern social media features completely free. 
       Upgrade to premium plans to unlock more advanced tools, tailored to your needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {features.map((feature) => (
          <PricingPackageBox data={feature} key={feature.name + feature.price} />
        ))}
      </div>
    </div>
  );
}

export default Pricing;
