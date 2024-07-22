import { Post, PostEditor } from "@/components/posts";
import { TrendsSidebar } from "@/components/trends";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

async function Home() {
  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex min-w-0 flex-1 gap-5">
      <div>
        <PostEditor />

        <section className="mt-5 min-w-0 space-y-5">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </section>
      </div>

      <TrendsSidebar />
    </main>
  );
}

export default Home;
