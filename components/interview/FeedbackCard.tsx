import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, MessageSquare, Sparkles } from "lucide-react";

interface FeedbackCardProps {
  score: number;
  strengths: string[];
  improvements: string[];
  overallComment: string;
}

function ScoreDisplay({ score }: { score: number }) {
  const color =
    score >= 8
      ? "from-emerald-500 to-green-500"
      : score >= 6
      ? "from-amber-500 to-yellow-500"
      : "from-red-500 to-rose-500";
  const bgColor =
    score >= 8
      ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800"
      : score >= 6
      ? "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800"
      : "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800";

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bgColor}`}>
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
        <span className="text-xl font-extrabold text-white">{score.toFixed(1)}</span>
      </div>
      <div>
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</div>
        <div className="text-sm font-semibold">
          {score >= 8 ? "Excellent!" : score >= 6 ? "Good" : "Needs Work"}
        </div>
      </div>
    </div>
  );
}

export default function FeedbackCard({
  score,
  strengths,
  improvements,
  overallComment,
}: FeedbackCardProps) {
  return (
    <Card className="border-primary/15 shadow-md overflow-hidden">
      <div className="h-1.5 gradient-bg" />
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">AI Feedback</span>
          </div>
          <ScoreDisplay score={score} />
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
          <MessageSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-sm leading-relaxed">{overallComment}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800/50">
              <div className="flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Strengths</span>
              </div>
              <ul className="space-y-2">
                {strengths.map((s, i) => (
                  <li key={i} className="text-sm text-emerald-700 dark:text-emerald-300/80 flex gap-2">
                    <span className="text-emerald-500 dark:text-emerald-400 shrink-0 font-bold">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {improvements.length > 0 && (
            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-800/50">
              <div className="flex items-center gap-1.5 mb-3">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">Improve</span>
              </div>
              <ul className="space-y-2">
                {improvements.map((imp, i) => (
                  <li key={i} className="text-sm text-blue-700 dark:text-blue-300/80 flex gap-2">
                    <span className="text-blue-500 dark:text-blue-400 shrink-0">&#8594;</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
