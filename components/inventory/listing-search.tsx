"use client";

import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ListingSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ListingSearch({
  onChange,
  value,
  placeholder = "Search",
}: ListingSearchProps) {
  return (
    <div className="relative w-full">
      <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

      <Input
        placeholder={placeholder}
        className="w-full bg-background shadow-none border-border pl-8 focus-visible:ring-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
