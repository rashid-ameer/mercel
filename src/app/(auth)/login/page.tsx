import { Metadata } from "next";
import loginImage from "@/assets/login-image.jpg";
import {
  AuthCard,
  AuthHeading,
  AuthImage,
  AuthRedirect,
  AuthTop,
  LoginForm,
} from "@/components/auth";
import { GoogleSignInButton } from "@/components";

export const metadata: Metadata = {
  title: "Login",
};

function Login() {
  return (
    <AuthCard>
      {/* top header */}
      <div className="w-full overflow-y-auto p-10 md:w-1/2">
        <AuthTop>
          <AuthHeading title="Login" />
        </AuthTop>

        <GoogleSignInButton />

        <div className="my-5 flex items-center gap-2">
          <span className="h-px flex-1 bg-muted" />
          <span>OR</span>
          <span className="h-px flex-1 bg-muted" />
        </div>

        {/* Login form */}
        <LoginForm />

        {/* Redirect to signup action */}
        <AuthRedirect
          link="/signup"
          title="Signup"
          content="Don't have an account?"
        />
      </div>

      {/* Image here */}
      <AuthImage src={loginImage} />
    </AuthCard>
  );
}
export default Login;
