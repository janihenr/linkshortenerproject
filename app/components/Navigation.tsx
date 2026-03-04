"use client";

import { useAuth } from "@clerk/nextjs";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="site-nav">
      {!isSignedIn ? (
        <>
          <SignInButton mode="modal">
            <Button variant="ghost">Sign in</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign up</Button>
          </SignUpButton>
        </>
      ) : (
        <UserButton />
      )}
    </nav>
  );
}
