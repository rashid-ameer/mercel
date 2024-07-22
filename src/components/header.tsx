import Link from "next/link";
import UserButton from "./user-button";
import Search from "./search";

function Header() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-3 sm:justify-start md:px-5">
        <Link href="/" className="text-2xl font-bold text-primary sm:mr-5">
          Mercel
        </Link>
        <Search />
        <UserButton className="sm:ml-auto" />
      </div>
    </header>
  );
}
export default Header;
