import { validateRequest } from "@/auth";
import { UserProfile } from "@/components";
import { UserFeed } from "@/components/posts";
import { TrendsSidebar } from "@/components/trends";
import { getUserDetails } from "@/lib/server-utils";

interface UserAccountProps {
  params: {
    username: string;
  };
}

// generating metadata for the page
export async function generateMetadata({
  params: { username },
}: UserAccountProps) {
  //  validate user
  const { user } = await validateRequest();

  if (!user) return {};

  // fetch userdata
  const userDetails = await getUserDetails(username, user.id);

  return {
    title: `${userDetails.displayName} | (@${userDetails.username}) `,
  };
}

// the page component
async function UserAccount({ params: { username } }: UserAccountProps) {
  const { user: loggedInUser } = await validateRequest();

  // user will unable to reach this point because he/she will be already redirected
  if (!loggedInUser) return null;

  // fetch userdata
  const user = await getUserDetails(username, loggedInUser.id);

  return (
    <main className="flex flex-1 gap-5 p-5">
      <div className="flex-1 space-y-5">
        <UserProfile loggedInUserId={loggedInUser.id} user={user} />

        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>

        <UserFeed userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
export default UserAccount;
