"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRoleById, getLevelLabel } from "@/lib/roles";
import { ArrowRight, Clock, CheckCircle2, Plus, BrainCircuit } from "lucide-react";

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

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <Badge variant="outline">In Progress</Badge>;
  const color =
    score >= 8
      ? "bg-green-100 text-green-700 border-green-200"
      : score >= 6
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : "bg-red-100 text-red-700 border-red-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {score.toFixed(1)} / 10
    </span>
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Track your interview practice progress
            </p>
          </div>
          <Link href="/interview/setup">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Interview
            </Button>
          </Link>
        </div>

        {/* Stats */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold">{sessions.length}</div>
                <div className="text-sm text-muted-foreground mt-1">Total Sessions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold">{completedSessions.length}</div>
                <div className="text-sm text-muted-foreground mt-1">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">
                  {avgScore !== null ? avgScore.toFixed(1) : "—"}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Avg Score</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sessions List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20">
            <BrainCircuit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No interviews yet</h2>
            <p className="text-muted-foreground mb-6">
              Start your first mock interview to see your results here
            </p>
            <Link href="/interview/setup">
              <Button className="gap-2">
                Start First Interview
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold mb-3">Recent Sessions</h2>
            {sessions.map((session) => {
              const role = getRoleById(session.role);
              return (
                <Card key={session.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{role?.icon ?? "💼"}</span>
                        <div>
                          <div className="font-medium">{role?.label ?? session.role}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getLevelLabel(session.level)}
                            </Badge>
                            {session.status === "completed" ? (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                Completed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                In Progress
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(session.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ScoreBadge score={session.overallScore} />
                        <Link
                          href={
                            session.status === "completed"
                              ? `/interview/${session.id}/results`
                              : `/interview/${session.id}`
                          }
                        >
                          <Button variant="ghost" size="sm" className="gap-1">
                            {session.status === "completed" ? "View" : "Continue"}
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
