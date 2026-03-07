"use client";

import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span>InterviewAI</span>
        </Link>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/interview/setup">
                <Button size="sm">Start Interview</Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <Link href="/sign-up">
                <Button size="sm">Get Started Free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
