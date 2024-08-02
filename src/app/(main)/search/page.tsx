import { SearchResults } from "@/components";
import Search from "@/components/search";
import { TrendsSidebar } from "@/components/trends";

interface SearchpageProps {
  searchParams: { q: string };
}

export function generateMetadata({ searchParams: { q } }: SearchpageProps) {
  return {
    title: `Search Results for "${q}"`,
  };
}

function Searchpage({ searchParams: { q } }: SearchpageProps) {
  return (
    <main className="flex flex-1 gap-5">
      <div className="flex-1 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">
            Search Results for &quot;{q}&quot;
          </h1>
        </div>
        <SearchResults q={q} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
export default Searchpage;
