import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingUp, MessageSquare } from "lucide-react";

interface FeedbackCardProps {
  score: number;
  strengths: string[];
  improvements: string[];
  overallComment: string;
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 8 ? "text-green-500" : score >= 6 ? "text-yellow-500" : "text-red-500";
  return (
    <div className={`text-4xl font-bold ${color}`}>
      {score.toFixed(1)}
      <span className="text-lg text-muted-foreground font-normal">/10</span>
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
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">AI Feedback</CardTitle>
          <ScoreRing score={score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">{overallComment}</p>
        </div>

        {strengths.length > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Strengths</span>
            </div>
            <ul className="space-y-1">
              {strengths.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-green-500 shrink-0">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {improvements.length > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Improve On</span>
            </div>
            <ul className="space-y-1">
              {improvements.map((imp, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-blue-500 shrink-0">→</span>
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
