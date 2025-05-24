import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export interface CommentData {
  rate: string;
  username: string;
  auth: string;
  image: string;
}

interface Props {
  data: CommentData;
}

const CommentBox: React.FC<Props> = ({ data }) => {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6 pb-16">
        {/* Stars */}
        <div className="mb-4 flex justify-center">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        {/* Comment Text */}
        <p className="mb-6 text-center text-sm text-muted-foreground leading-relaxed">
          {data.rate}
        </p>

        {/* User Info */}
        <div className="text-center">
          <h3 className="font-semibold text-foreground">{data.username}</h3>
          <span className="text-sm text-orange-500 font-medium">
            {data.auth}
          </span>
        </div>
      </CardContent>

      {/* Avatar positioned at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
        <Avatar className="h-12 w-12 border-4 border-background shadow-lg">
          <AvatarImage
            src={data.image || "/placeholder.svg"}
            alt={data.username}
          />
          <AvatarFallback>{data.username.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </Card>
  );
};

export default CommentBox;
