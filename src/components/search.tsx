"use client";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

function Search() {
  const router = useRouter();

  // submit handler
  const onSumbit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;

    if (!search) return;

    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <form onSubmit={onSumbit} method="GET" action="/search">
      <div className="relative">
        <Input name="search" className="pr-10" placeholder="Search" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      </div>
    </form>
  );
}
export default Search;
