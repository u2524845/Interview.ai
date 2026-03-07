"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FeedbackCard from "@/components/interview/FeedbackCard";
import { getRoleLabel, getLevelLabel } from "@/lib/roles";
import {
  ArrowRight,
  LayoutDashboard,
  Loader2,
  Trophy,
  Target,
  Lightbulb,
} from "lucide-react";

interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  overallComment: string;
}

interface Answer {
  id: string;
  content: string;
  feedback: Feedback | null;
}

interface Question {
  id: string;
  content: string;
  orderIndex: number;
  answer: Answer | null;
}

interface SessionSummary {
  summary: string;
  topStrength: string;
  topImprovement: string;
  recommendation: "ready" | "needs_practice" | "not_ready";
}

interface ResultsData {
  session: {
    id: string;
    role: string;
    level: string;
    overallScore: number | null;
    questions: Question[];
  };
  summary: SessionSummary | null;
}

const recommendationConfig = {
  ready: {
    label: "Interview Ready",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    icon: Trophy,
  },
  needs_practice: {
    label: "Keep Practicing",
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
    icon: Target,
  },
  not_ready: {
    label: "More Practice Needed",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    icon: Lightbulb,
  },
};

export default function ResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/sessions/${sessionId}/results`)
      .then((r) => r.json())
      .then((d: ResultsData) => setData(d))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Generating your results...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { session, summary } = data;
  const rec = summary
    ? recommendationConfig[summary.recommendation]
    : null;
  const RecIcon = rec?.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Interview Complete!</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="secondary">{getRoleLabel(session.role)}</Badge>
            <Badge variant="outline">{getLevelLabel(session.level)}</Badge>
          </div>
          {session.overallScore != null && (
            <div className="inline-flex items-baseline gap-1">
              <span className="text-6xl font-bold text-primary">
                {session.overallScore.toFixed(1)}
              </span>
              <span className="text-2xl text-muted-foreground">/10</span>
            </div>
          )}
        </div>

        {/* AI Summary */}
        {summary && rec && RecIcon && (
          <Card className={`mb-6 border ${rec.bg}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <RecIcon className={`h-5 w-5 ${rec.color}`} />
                <span className={`font-semibold ${rec.color}`}>{rec.label}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{summary.summary}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                  <p className="text-xs font-medium text-green-700 mb-1">Top Strength</p>
                  <p className="text-sm text-green-800">{summary.topStrength}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-xs font-medium text-blue-700 mb-1">Focus On</p>
                  <p className="text-sm text-blue-800">{summary.topImprovement}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Per-question breakdown */}
        <h2 className="text-lg font-semibold mb-4">Question Breakdown</h2>
        <div className="space-y-4 mb-8">
          {session.questions.map((q, i) => (
            <Card key={q.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Question {i + 1}
                    </p>
                    <CardTitle className="text-base font-medium leading-snug">
                      {q.content}
                    </CardTitle>
                  </div>
                  {q.answer?.feedback && (
                    <span
                      className={`text-2xl font-bold shrink-0 ${
                        q.answer.feedback.score >= 8
                          ? "text-green-500"
                          : q.answer.feedback.score >= 6
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {q.answer.feedback.score.toFixed(1)}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {q.answer && (
                  <div className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Your Answer
                    </p>
                    <p className="text-sm">{q.answer.content}</p>
                  </div>
                )}
                {q.answer?.feedback && (
                  <FeedbackCard
                    score={q.answer.feedback.score}
                    strengths={q.answer.feedback.strengths}
                    improvements={q.answer.feedback.improvements}
                    overallComment={q.answer.feedback.overallComment}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/interview/setup" className="flex-1">
            <Button className="w-full gap-2">
              Try Another Interview
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
