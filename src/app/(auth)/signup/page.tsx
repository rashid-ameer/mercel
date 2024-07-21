import signupImage from "@/assets/signup-image.jpg";
import {
  AuthCard,
  AuthHeading,
  AuthImage,
  AuthRedirect,
  AuthTop,
  SignupForm,
} from "@/components/auth";

function Signup() {
  return (
    <AuthCard>
      <div className="w-full overflow-y-auto p-10 md:w-1/2">
        {/* top header */}
        <AuthTop>
          <AuthHeading title="Signin to Mercel" />

          <p className="text-muted-foreground">
            A place where <span className="italic">you</span> can find a friend.
          </p>
        </AuthTop>

        {/* Signup form */}
        <SignupForm />

        {/* Redirect to login  action */}
        <AuthRedirect
          link="/login"
          title="Login"
          content="Already have an account?"
        />
      </div>

      {/* Image here */}
      <AuthImage src={signupImage} />
    </AuthCard>
  );
}
export default Signup;
