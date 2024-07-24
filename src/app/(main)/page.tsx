import { FollowingFeed, PostEditor, PostFeed } from "@/components/posts";
import { TrendsSidebar } from "@/components/trends";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Home() {
  return (
    <main className="flex min-w-0 flex-1 gap-5">
      <div className="flex-1 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <PostFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
          you
        </Tabs>
      </div>

      <TrendsSidebar />
    </main>
  );
}

export default Home;
