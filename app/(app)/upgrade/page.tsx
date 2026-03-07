"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Check,
  ArrowRight,
  Sparkles,
  Loader2,
  Zap,
  BarChart3,
  Mic,
  BrainCircuit,
  Infinity,
} from "lucide-react";

const proFeatures = [
  { icon: Infinity, label: "Unlimited mock interviews", desc: "Practice as many times as you need" },
  { icon: BrainCircuit, label: "All 6+ job roles", desc: "Software Engineer, PM, UX, DevOps and more" },
  { icon: Sparkles, label: "Detailed AI feedback", desc: "Scores, strengths, and improvement tips per answer" },
  { icon: Mic, label: "Voice & text input", desc: "Speak or type your answers naturally" },
  { icon: BarChart3, label: "Full session history", desc: "Track your scores and improvement over time" },
  { icon: Zap, label: "Priority AI processing", desc: "Faster question generation and feedback" },
];

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Already on Pro plan") {
          router.push("/dashboard");
          return;
        }
        throw new Error(data.error ?? "Failed to start checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-14 fade-in">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5 glow-sm pulse-glow">
            <Crown className="h-7 w-7 text-white" />
          </div>
          <Badge className="mb-4 gradient-bg border-0 text-white px-4 py-1.5 text-sm">
            Pro Plan
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Unlock <span className="gradient-text">Unlimited Practice</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            One flat monthly price. Practice as many interviews as you want, across all roles and levels.
          </p>
        </div>

        {/* Pricing + Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Price Card */}
          <Card className="border-2 border-primary/30 shadow-xl glow relative overflow-hidden">
            <div className="h-1.5 gradient-bg" />
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <Crown className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">Pro</span>
                <Badge className="gradient-bg border-0 text-white text-xs ml-auto">Most Popular</Badge>
              </div>

              <div className="mb-2">
                <span className="text-6xl font-extrabold gradient-text">$9</span>
                <span className="text-muted-foreground text-lg ml-2">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">
                Cancel anytime. No hidden fees.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button
                size="lg"
                className="w-full gap-2 gradient-bg border-0 text-white hover:opacity-90 transition-opacity h-13 text-base"
                onClick={handleUpgrade}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Redirecting to checkout...
                  </>
                ) : (
                  <>
                    <Crown className="h-5 w-5" />
                    Upgrade to Pro
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure payment via Stripe. Your card details are never stored on our servers.
              </p>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card className="border-border/60">
            <CardContent className="p-8">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Everything included
              </h3>
              <ul className="space-y-5">
                {proFeatures.map((f) => (
                  <li key={f.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0 mt-0.5">
                      <f.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{f.label}</div>
                      <div className="text-xs text-muted-foreground">{f.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Comparison */}
        <Card className="border-border/60 mb-10">
          <CardContent className="p-6">
            <h3 className="font-semibold text-center mb-6">Free vs Pro</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="font-medium text-muted-foreground">Feature</div>
              <div className="font-semibold text-center">Free</div>
              <div className="font-semibold text-center gradient-text">Pro</div>

              {[
                ["Mock interviews", "1 total", "Unlimited"],
                ["Job roles", "All roles", "All roles"],
                ["AI feedback", "Yes", "Yes"],
                ["Voice input", "Yes", "Yes"],
                ["Session history", "Limited", "Full history"],
                ["AI processing", "Standard", "Priority"],
              ].map(([feature, free, pro]) => (
                <>
                  <div key={feature} className="py-2 border-t border-border/50 text-muted-foreground">{feature}</div>
                  <div key={`${feature}-free`} className="py-2 border-t border-border/50 text-center">{free}</div>
                  <div key={`${feature}-pro`} className="py-2 border-t border-border/50 text-center font-medium text-primary">{pro}</div>
                </>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-muted-foreground">
              Maybe later — go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
