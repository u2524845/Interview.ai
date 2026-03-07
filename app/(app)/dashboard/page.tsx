"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRoleById, getLevelLabel } from "@/lib/roles";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Plus,
  BrainCircuit,
  Sparkles,
  TrendingUp,
  BarChart3,
  Zap,
} from "lucide-react";

interface Session {
  id: string;
  role: string;
  level: string;
  status: string;
  overallScore: number | null;
  createdAt: string;
  completedAt: string | null;
  _count: { questions: number };
}

function ScoreDisplay({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <Badge variant="outline" className="text-xs gap-1 px-2.5 py-1">
        <Clock className="h-3 w-3" />
        In Progress
      </Badge>
    );
  }
  const color =
    score >= 8
      ? "from-emerald-500 to-teal-500"
      : score >= 6
      ? "from-amber-500 to-orange-500"
      : "from-rose-500 to-pink-500";
  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${color}`}>
      {score.toFixed(1)}/10
    </div>
  );
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d: { sessions: Session[] }) => setSessions(d.sessions))
      .finally(() => setLoading(false));
  }, []);

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const avgScore =
    completedSessions.length > 0
      ? completedSessions
          .filter((s) => s.overallScore !== null)
          .reduce((acc, s) => acc + (s.overallScore ?? 0), 0) /
        completedSessions.filter((s) => s.overallScore !== null).length
      : null;

  const bestScore = completedSessions.length > 0
    ? Math.max(...completedSessions.filter((s) => s.overallScore !== null).map((s) => s.overallScore!))
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Your <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Track your interview practice progress
            </p>
          </div>
          <Link href="/interview/setup">
            <Button className="gap-2 gradient-bg border-0 text-white hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4" />
              New Interview
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <Card className="border-border/60 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
              <CardContent className="pt-5 pb-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-extrabold">{sessions.length}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Total Sessions</div>
              </CardContent>
            </Card>
            <Card className="border-border/60 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <CardContent className="pt-5 pb-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="text-2xl font-extrabold">{completedSessions.length}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Completed</div>
              </CardContent>
            </Card>
            <Card className="border-border/60 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardContent className="pt-5 pb-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-extrabold gradient-text">
                  {avgScore !== null ? avgScore.toFixed(1) : "—"}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Avg Score</div>
              </CardContent>
            </Card>
            <Card className="border-border/60 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <CardContent className="pt-5 pb-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                </div>
                <div className="text-2xl font-extrabold text-amber-500">
                  {bestScore !== null ? bestScore.toFixed(1) : "—"}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Best Score</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sessions List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted/50 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-24 fade-in">
            <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 glow-sm">
              <BrainCircuit className="h-9 w-9 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No interviews yet</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Start your first AI mock interview to see your results and track progress here.
            </p>
            <Link href="/interview/setup">
              <Button size="lg" className="gap-2 gradient-bg border-0 text-white hover:opacity-90 transition-opacity">
                <Sparkles className="h-4 w-4" />
                Start First Interview
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-3.5 w-3.5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Recent Sessions</h2>
            </div>
            <div className="space-y-3">
              {sessions.map((session) => {
                const role = getRoleById(session.role);
                return (
                  <Link
                    key={session.id}
                    href={
                      session.status === "completed"
                        ? `/interview/${session.id}/results`
                        : `/interview/${session.id}`
                    }
                  >
                    <Card className="group border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer mb-3">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/5 border border-border/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
                              {role?.icon ?? "💼"}
                            </div>
                            <div>
                              <div className="font-semibold text-base">
                                {role?.label ?? session.role}
                              </div>
                              <div className="flex items-center gap-2 mt-1.5">
                                <Badge variant="outline" className="text-xs">
                                  {getLevelLabel(session.level)}
                                </Badge>
                                {session.status === "completed" ? (
                                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Completed
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    In Progress
                                  </span>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(session.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <ScoreDisplay score={session.overallScore} />
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
