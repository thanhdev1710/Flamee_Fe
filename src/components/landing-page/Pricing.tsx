"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import PricingPackageBox, { PricingPackageData } from "./PricingPackageBox";

function Pricing() {
  const [features] = useState<PricingPackageData[]>([
    {
      name: "Standard User",
      price: "$14.90",
      unit: "month",
      features: [
        { status: "correct", name: "5 Social posts per month" },
        { status: "correct", name: "15 Social interactions per day" },
        { status: "correct", name: "+1 Extra user" },
        { status: "correct", name: "3 level analytics" },
        { status: "correct", name: "Achievement Awards" },
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
        { status: "correct", name: "10 Social posts per month" },
        { status: "correct", name: "Unlimited daily interactions" },
        { status: "correct", name: "+3 Extra users" },
        { status: "correct", name: "Advanced analytics" },
        { status: "correct", name: "Achievement Awards" },
        { status: "correct", name: "Priority support" },
      ],
      button: "Get Started",
      isActive: true,
    },
    {
      name: "Enterprise User",
      price: "$54.90",
      unit: "month",
      features: [
        { status: "correct", name: "Unlimited social posts" },
        { status: "correct", name: "Unlimited daily interactions" },
        { status: "correct", name: "Unlimited users" },
        { status: "correct", name: "Full analytics suite" },
        { status: "correct", name: "Achievement Awards" },
        { status: "correct", name: "24/7 dedicated support" },
      ],
      button: "Get Started",
      isActive: false,
    },
  ]);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100"
          >
            Pricing
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            How Much Do I Have to Pay?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Enjoy modern social media features completely free. Upgrade to
            premium plans to unlock more advanced tools, tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <PricingPackageBox
              data={feature}
              key={`${feature.name}-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
