"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroButtons() {
  const { isSignedIn } = useUser();
  const href = isSignedIn ? "/interview/setup" : "/sign-up";

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link href={href}>
        <Button size="lg" className="gap-2 text-base px-8">
          Start Practicing Free
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
      {!isSignedIn && (
        <Link href="/sign-in">
          <Button size="lg" variant="outline" className="text-base px-8">
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
}
