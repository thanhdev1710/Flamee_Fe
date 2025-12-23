import { Card, CardContent } from "@/components/ui/card";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type FeatureBoxProps = {
  feature: {
    name: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    description: string;
  };
};

function FeatureBox({ feature }: FeatureBoxProps) {
  const displayName = {
    Image: "Create Image",
    Follower: "Control Followers",
    Post: "Edit Post",
    Activities: "Activities Control",
    Social: "Add Social",
    Comment: "Save Your Comments",
  }[feature.name];

  return (
    <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center h-[280px]">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
          {<feature.icon />}
        </div>
        <h3 className="mb-3 text-lg font-semibold text-foreground">
          {displayName}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
}

export default FeatureBox;
