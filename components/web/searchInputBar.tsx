import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import React from "react";

const SearchInputBar: React.FC = () => {
  const [keyword, setKeyword] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const results = useQuery(
    api.posts.searchPosts,
    keyword.length > 2 ? { keyword: keyword, limit: 5 } : "skip",
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className="md:block hidden mr-2">
      <div className="relative w-full max-w-sm z-10">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Posts..."
            className="w-full pl-8 bg-background"
            value={keyword}
            onChange={handleInputChange}
          />
        </div>

        {isOpen && keyword.length > 2 ? (
          <div className="absolute top-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
            {results === undefined ? (
              <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Searching...
              </div>
            ) : results.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground text-center">
                No results found!
              </p>
            ) : (
              <div className="py-1">
                {results.map((post) => (
                  <Link
                    className="flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    href={`/blogs/${post._id}`}
                    key={post._id}
                    onClick={() => {
                      setIsOpen(false);
                      setKeyword("");
                    }}
                  >
                    <p className="font-medium truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground pt-1">
                      {post.body.substring(0, 60)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchInputBar;
