"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROLES, LEVELS } from "@/lib/roles";
import { ArrowRight, Loader2, Sparkles, Clock, Mic, BrainCircuit, Crown, Check, X } from "lucide-react";

export default function InterviewSetupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function startInterview() {
    if (!selectedRole || !selectedLevel) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole, level: selectedLevel }),
      });

      const data = await res.json().catch(() => ({ error: "Server error. Please try again." }));

      if (!res.ok) {
        if (data.error === "FREE_LIMIT_REACHED") {
          setShowUpgrade(true);
          setLoading(false);
          return;
        }
        throw new Error(data.message ?? data.error ?? "Failed to create session");
      }

      const { sessionId } = data;
      router.push(`/interview/${sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const selectedRoleData = ROLES.find((r) => r.id === selectedRole);
  const selectedLevelData = LEVELS.find((l) => l.id === selectedLevel);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5 glow-sm">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Set Up Your <span className="gradient-text">Interview</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose your target role and experience level. AI will generate 5 tailored questions just for you.
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <h2 className="text-lg font-semibold">Choose Your Role</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROLES.filter((r) => r.enabled).map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`group text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === role.id
                    ? "border-primary bg-primary/5 shadow-md glow-sm"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform duration-200">{role.icon}</span>
                <div className="font-semibold">{role.label}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {role.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Level Selection */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">2</span>
            </div>
            <h2 className="text-lg font-semibold">Select Experience Level</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`text-center p-5 rounded-xl border-2 transition-all duration-200 ${
                  selectedLevel === level.id
                    ? "border-primary bg-primary/5 shadow-md glow-sm"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                <div className="font-semibold text-base">{level.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {level.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        {selectedRole && selectedLevel && (
          <Card className="mb-6 border-primary/20 bg-primary/5 shadow-md fade-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="h-5 w-5 text-primary" />
                <span className="font-semibold">Interview Preview</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="text-sm px-3 py-1 gap-1.5">
                  {selectedRoleData?.icon} {selectedRoleData?.label}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {selectedLevelData?.label}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>5 Questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>~15 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mic className="h-3.5 w-3.5 text-primary" />
                  <span>Voice & Text</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <Button
          size="lg"
          className="w-full gap-2 h-13 text-base gradient-bg border-0 text-white hover:opacity-90 transition-opacity"
          disabled={!selectedRole || !selectedLevel || loading}
          onClick={startInterview}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              AI is generating your questions...
            </>
          ) : (
            <>
              Start Interview
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowUpgrade(false)}
          />
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl fade-in overflow-hidden">
            {/* Gradient header */}
            <div className="gradient-bg px-6 py-8 text-center text-white relative">
              <button
                onClick={() => setShowUpgrade(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-1">Upgrade to Pro</h3>
              <p className="text-white/80 text-sm">
                You've used your free interview. Unlock unlimited practice!
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <span className="text-4xl font-extrabold">$9</span>
                <span className="text-muted-foreground ml-1">/ month</span>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  "Unlimited mock interviews",
                  "All 6+ job roles",
                  "Detailed AI feedback & scoring",
                  "Voice & text input",
                  "Full session history & analytics",
                  "Priority AI processing",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="w-full gap-2 gradient-bg border-0 text-white hover:opacity-90 transition-opacity"
                onClick={() => {
                  router.push("/upgrade");
                }}
              >
                <Crown className="h-4 w-4" />
                Upgrade Now
              </Button>
              <button
                onClick={() => setShowUpgrade(false)}
                className="w-full text-center text-sm text-muted-foreground mt-3 hover:text-foreground transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
