type AuthTopProps = {
  children: React.ReactNode;
};

function AuthTop({ children }: AuthTopProps) {
  return <div className="mb-6 space-y-1 text-center">{children}</div>;
}
export default AuthTop;
