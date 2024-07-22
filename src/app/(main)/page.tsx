import { Post, PostEditor } from "@/components/posts";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

async function Home() {
  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-w-0 flex-1">
      <PostEditor />

      <section className="mt-5 min-w-0 space-y-5">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </section>
    </main>
  );
}

export default Home;
