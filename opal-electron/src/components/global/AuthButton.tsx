import { SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Button } from "../ui/button";


export default function AuthButton() {
  return (
    <SignedOut>
      <div className="flex gap-x-3 h-screen justify-center items-center">
        <SignInButton>
          <Button
            variant={"outline"}
            className="px-10 rounded-full hover:bg-gray-200"
          >
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button
            variant={"outline"}
            className="px-10 rounded-full hover:bg-gray-200"
          >
            Sign Up
          </Button>
        </SignUpButton>
      </div>
    </SignedOut>
  );
}