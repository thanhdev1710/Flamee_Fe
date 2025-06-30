import { Search } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";

export default function MobileSearch() {
  return (
    <div className="md:hidden mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="Search" className="pl-10 bg-white border" />
      </div>
    </div>
  );
}
