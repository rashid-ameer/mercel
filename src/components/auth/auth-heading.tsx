type AuthHeadingProps = {
  title: string;
};

function AuthHeading({ title }: AuthHeadingProps) {
  return <h1 className="text-3xl font-medium">{title}</h1>;
}
export default AuthHeading;
