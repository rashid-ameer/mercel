import { useUserDataQuery } from "@/lib/react-query-utils";
import { UserTooltip } from "@/components";

interface UserLinkWithTooltipProps {
  username: string;
  children: React.ReactNode;
}

function UserLinkWithTooltip({ username, children }: UserLinkWithTooltipProps) {
  const { data } = useUserDataQuery(username);

  if (!data) {
    return children;
  }

  return <UserTooltip user={data}>{children}</UserTooltip>;
}
export default UserLinkWithTooltip;
