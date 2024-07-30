import Link from "next/link";
import { LinkItUrl, LinkIt, LinkItEmail } from "react-linkify-it";
import UserLinkWithTooltip from "./user-link-with-tooltip";

interface LinkifyProps {
  children: React.ReactNode;
}

interface LinkPropsExtended extends LinkifyProps {
  className: string;
}

function Linkify({ children }: LinkifyProps) {
  const className = "text-primary hover:underline";

  return (
    <LinkifyUrl className={className}>
      <LinkifyEmail className={className}>
        <LinkifyUsername className={className}>
          <LinkfiyHashtag className={className}>{children}</LinkfiyHashtag>
        </LinkifyUsername>
      </LinkifyEmail>
    </LinkifyUrl>
  );
}

export default Linkify;

function LinkifyEmail({ children, className }: LinkPropsExtended) {
  return <LinkItEmail className={className}>{children}</LinkItEmail>;
}

function LinkifyUrl({ children, className }: LinkPropsExtended) {
  return <LinkItUrl className={className}>{children}</LinkItUrl>;
}

function LinkifyUsername({ children, className }: LinkPropsExtended) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <UserLinkWithTooltip key={key} username={match.slice(1)}>
          <Link href={`/users/${match.slice(1)}`} className={className}>
            {match}
          </Link>
        </UserLinkWithTooltip>
      )}
    >
      {children}
    </LinkIt>
  );
}

function LinkfiyHashtag({ children, className }: LinkPropsExtended) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9.]+)/}
      component={(match, key) => (
        <Link
          href={`/hashtag/${match.slice(1)}`}
          key={key}
          className={className}
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}
