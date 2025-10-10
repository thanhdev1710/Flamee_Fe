import type React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

type FeatureItem = {
  status: "correct" | "uncorrect";
  name: string;
};

export type PricingPackageData = {
  name: string;
  price: string;
  unit: string;
  features: FeatureItem[];
  button: string;
  isActive: boolean;
};

type Props = {
  data: PricingPackageData;
};

const PricingPackageBox: React.FC<Props> = ({ data }) => {
  const { name, price, unit, features, button, isActive } = data;

  return (
    <Card
      className={`relative transition-all duration-300 hover:shadow-lg ${
        isActive ? "border-primary shadow-lg scale-105" : "hover:-translate-y-1"
      }`}
    >
      {isActive && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
          Most Popular
        </Badge>
      )}

      <CardHeader className="text-center pb-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <div className="flex items-baseline justify-center">
          <span className="text-3xl font-bold text-primary">{price}</span>
          <span className="text-sm text-muted-foreground ml-1">/{unit}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {features.map((item, index) => (
            <li key={index} className="flex items-center space-x-3">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  item.status === "correct"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {item.status === "correct" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </div>
              <span
                className={`text-sm ${
                  item.status === "uncorrect"
                    ? "text-muted-foreground line-through"
                    : ""
                }`}
              >
                {item.name}
              </span>
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          variant={isActive ? "default" : "outline"}
          size="lg"
        >
          {button}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingPackageBox;
