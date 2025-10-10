import { User, Calendar, MapPin, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function AboutCard() {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          About
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm group hover:bg-muted/50 p-2 rounded-lg transition-colors">
            <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              Male
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm group hover:bg-muted/50 p-2 rounded-lg transition-colors">
            <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              Born June 26, 1980
            </span>
          </div>
          <div className="flex items-start gap-3 text-sm group hover:bg-muted/50 p-2 rounded-lg transition-colors">
            <div className="p-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 mt-0.5">
              <MapPin className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            </div>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              2239 Hog Camp Road
              <br />
              Schaumburg
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm group hover:bg-muted/50 p-2 rounded-lg transition-colors">
            <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
              <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              charles5182@ummoh.com
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm group hover:bg-muted/50 p-2 rounded-lg transition-colors">
            <div className="p-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              3375005467
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
