import { BookmarkedFeed } from "@/components/bookmark";
import { TrendsSidebar } from "@/components/trends";

function BookmarksPage() {
  return (
    <main className="flex flex-1 gap-5">
      <div className="flex-1 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
        </div>
        <BookmarkedFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
}
export default BookmarksPage;
