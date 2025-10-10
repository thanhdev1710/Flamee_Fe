import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function YouMightKnow() {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 rounded-full" />
          You might know
        </h3>
        <div className="space-y-4">
          {[
            {
              name: "Eddie Lobanovskiy",
              email: "lobanovskiy@gmail.com",
              avatar: "EL",
              color: "from-blue-500 to-cyan-500",
            },
            {
              name: "Alexey Stave",
              email: "alexeyst@gmail.com",
              avatar: "AS",
              color: "from-purple-500 to-pink-500",
            },
            {
              name: "Anton Tkacheve",
              email: "tkacheveanton@gmail.com",
              avatar: "AT",
              color: "from-green-500 to-teal-500",
            },
          ].map((person, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group"
            >
              <Avatar className="w-10 h-10 ring-2 ring-transparent group-hover:ring-muted transition-all">
                <AvatarImage
                  src={`/placeholder.svg?height=40&width=40`}
                  alt={person.name}
                />
                <AvatarFallback
                  className={`bg-gradient-to-br ${person.color} text-white text-sm font-semibold`}
                >
                  {person.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-foreground group-hover:text-foreground transition-colors">
                  {person.name}
                </p>
                <p className="text-xs truncate text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                  {person.email}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-purple-200 hover:border-purple-300 dark:border-purple-700 dark:hover:border-purple-600 hover:shadow-md transition-all duration-200"
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
