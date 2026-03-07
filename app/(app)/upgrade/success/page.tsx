"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight, Sparkles, Check } from "lucide-react";

export default function UpgradeSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-24 text-center fade-in">
        <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 glow pulse-glow">
          <Crown className="h-9 w-9 text-white" />
        </div>

        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6">
          <Check className="h-6 w-6 text-white" />
        </div>

        <h1 className="text-4xl font-extrabold mb-3">
          Welcome to <span className="gradient-text">Pro!</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Your account has been upgraded. You now have unlimited access to all interviews and features.
        </p>

        <div className="space-y-3">
          <Link href="/interview/setup" className="block">
            <Button
              size="lg"
              className="w-full gap-2 gradient-bg border-0 text-white hover:opacity-90 transition-opacity"
            >
              <Sparkles className="h-5 w-5" />
              Start Practicing
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard" className="block">
            <Button variant="outline" size="lg" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
