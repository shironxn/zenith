"use client";

import { Search } from "lucide-react";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const NavSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = React.useState(searchParams.get("search") ?? "");

  React.useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const term = value.trim();
      const current = searchParams.get("search") ?? "";
      if (term === current) return;

      const params = new URLSearchParams(searchParams);
      params.delete("page");

      if (term) {
        params.set("search", term);
      } else {
        params.delete("search");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, searchParams, pathname, router]);

  return (
    <div className="flex h-10 items-center rounded border border-input pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2">
      <Search className="absolute pointer-events-none h-5" />
      <input
        className="w-full bg-transparent p-2 pl-8 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Search notes"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export { NavSearch };
