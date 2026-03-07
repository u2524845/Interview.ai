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
  Sparkles,
  TrendingUp,
  Star,
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
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "from-emerald-500 to-teal-500",
    icon: Trophy,
  },
  needs_practice: {
    label: "Keep Practicing",
    color: "text-amber-600 dark:text-amber-400",
    bg: "from-amber-500 to-orange-500",
    icon: Target,
  },
  not_ready: {
    label: "More Practice Needed",
    color: "text-rose-600 dark:text-rose-400",
    bg: "from-rose-500 to-pink-500",
    icon: Lightbulb,
  },
};

function getScoreColor(score: number) {
  if (score >= 8) return "text-emerald-500";
  if (score >= 6) return "text-amber-500";
  return "text-rose-500";
}

function getScoreGradient(score: number) {
  if (score >= 8) return "from-emerald-500 to-teal-500";
  if (score >= 6) return "from-amber-500 to-orange-500";
  return "from-rose-500 to-pink-500";
}

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
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: ResultsData) => setData(d))
      .catch((err) => console.error("Failed to load results:", err))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center fade-in">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5 glow-sm pulse-glow">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">AI is analyzing your performance...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { session, summary } = data;
  const rec = summary ? recommendationConfig[summary.recommendation] : null;
  const RecIcon = rec?.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Hero Score Section */}
        <div className="text-center mb-10 fade-in">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5 glow-sm">
            <Trophy className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Interview <span className="gradient-text">Complete!</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {getRoleLabel(session.role)}
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {getLevelLabel(session.level)}
            </Badge>
          </div>

          {session.overallScore != null && (
            <div className="inline-flex flex-col items-center">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full border-4 ${
                  session.overallScore >= 8 ? "border-emerald-200 dark:border-emerald-700" : session.overallScore >= 6 ? "border-amber-200 dark:border-amber-700" : "border-rose-200 dark:border-rose-700"
                } flex items-center justify-center bg-gradient-to-br ${
                  session.overallScore >= 8 ? "from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50" : session.overallScore >= 6 ? "from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50" : "from-rose-50 to-pink-50 dark:from-rose-950/50 dark:to-pink-950/50"
                }`}>
                  <div>
                    <span className={`text-5xl font-extrabold ${getScoreColor(session.overallScore)}`}>
                      {session.overallScore.toFixed(1)}
                    </span>
                    <span className="text-lg text-muted-foreground block -mt-1">/10</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendation Card */}
        {summary && rec && RecIcon && (
          <Card className="mb-8 border-2 border-primary/20 overflow-hidden shadow-lg fade-in">
            <div className={`h-1.5 bg-gradient-to-r ${rec.bg}`} />
            <CardContent className="p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rec.bg} flex items-center justify-center`}>
                  <RecIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className={`font-bold text-lg ${rec.color}`}>{rec.label}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{summary.summary}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800/50">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Top Strength</p>
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300/80 leading-relaxed">{summary.topStrength}</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-800/50">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Focus Area</p>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-300/80 leading-relaxed">{summary.topImprovement}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Per-question breakdown */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Question Breakdown</h2>
        </div>

        <div className="space-y-4 mb-10">
          {session.questions.map((q, i) => (
            <Card key={q.id} className="overflow-hidden border-border/60 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 bg-gradient-to-r from-muted/30 to-transparent">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center text-white bg-gradient-to-br ${
                        q.answer?.feedback ? getScoreGradient(q.answer.feedback.score) : "from-gray-400 to-gray-500"
                      }`}>
                        {i + 1}
                      </span>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                        Question {i + 1}
                      </p>
                    </div>
                    <CardTitle className="text-base font-medium leading-snug">
                      {q.content}
                    </CardTitle>
                  </div>
                  {q.answer?.feedback && (
                    <div className={`text-2xl font-extrabold shrink-0 ${getScoreColor(q.answer.feedback.score)}`}>
                      {q.answer.feedback.score.toFixed(1)}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                {q.answer && (
                  <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                    <p className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                      Your Answer
                    </p>
                    <p className="text-sm leading-relaxed">{q.answer.content}</p>
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
            <Button
              size="lg"
              className="w-full gap-2 gradient-bg border-0 text-white hover:opacity-90 transition-opacity"
            >
              Try Another Interview
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" size="lg" className="w-full gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
