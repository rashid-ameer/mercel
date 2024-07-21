import Image from "next/image";
import signupImage from "@/assets/signup-image.jpg";
import Link from "next/link";
import { SignupForm } from "@/components";

function Signup() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-md shadow-2xl">
        <div className="w-full overflow-y-auto p-10 md:w-1/2">
          <div className="mb-6 space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to Mercel</h1>
            <p className="text-muted-foreground">
              A place where <span className="italic">you</span> can find a
              friend.
            </p>
          </div>
          <div className="space-y-3">
            <SignupForm />

            <p className="text-center">
              Already have an account?
              <Link href="/login" className="ml-2 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
        <Image
          src={signupImage}
          alt=""
          priority
          className="hidden object-cover md:block md:w-1/2"
          sizes="(max-width: 1024px) 50vw, 32rem"
          placeholder="blur"
        />
      </div>
    </main>
  );
}
export default Signup;
