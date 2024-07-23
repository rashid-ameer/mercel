import { PostEditor, PostFeed } from "@/components/posts";
import { TrendsSidebar } from "@/components/trends";

function Home() {
  return (
    <main className="flex min-w-0 flex-1 gap-5">
      <div className="flex-1">
        <PostEditor />

        <section className="mt-5 space-y-5">
          <PostFeed />
        </section>
      </div>

      <TrendsSidebar />
    </main>
  );
}

export default Home;
