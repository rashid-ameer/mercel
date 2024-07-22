type AuthCardProps = {
  children: React.ReactNode;
};

function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="flex w-full max-w-[64rem] overflow-hidden rounded-md shadow-2xl md:h-full md:max-h-[40rem]">
      {children}
    </div>
  );
}
export default AuthCard;
