"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROLES, LEVELS } from "@/lib/roles";
import { ArrowRight, Loader2 } from "lucide-react";

export default function InterviewSetupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create session");
      }

      const { sessionId } = await res.json();
      router.push(`/interview/${sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Set Up Your Interview</h1>
          <p className="text-muted-foreground">
            Choose your target role and experience level to get tailored questions
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Select Interview Role</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROLES.filter((r) => r.enabled).map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  selectedRole === role.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <span className="text-2xl mb-2 block">{role.icon}</span>
                <div className="font-medium">{role.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {role.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Level Selection */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Select Experience Level</h2>
          <div className="grid grid-cols-3 gap-3">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`text-center p-4 rounded-lg border-2 transition-all ${
                  selectedLevel === level.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="font-medium">{level.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {level.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary + Start */}
        {selectedRole && selectedLevel && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Interview Preview</CardTitle>
              <CardDescription>
                You&apos;ll get 5 AI-generated questions for this role
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Badge variant="secondary">
                {ROLES.find((r) => r.id === selectedRole)?.icon}{" "}
                {ROLES.find((r) => r.id === selectedRole)?.label}
              </Badge>
              <Badge variant="outline">
                {LEVELS.find((l) => l.id === selectedLevel)?.label}
              </Badge>
              <Badge variant="outline">5 Questions</Badge>
            </CardContent>
          </Card>
        )}

        {error && (
          <p className="text-destructive text-sm mb-4 text-center">{error}</p>
        )}

        <Button
          size="lg"
          className="w-full gap-2"
          disabled={!selectedRole || !selectedLevel || loading}
          onClick={startInterview}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Questions...
            </>
          ) : (
            <>
              Start Interview
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
