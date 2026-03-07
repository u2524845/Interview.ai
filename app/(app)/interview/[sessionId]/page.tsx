"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import FeedbackCard from "@/components/interview/FeedbackCard";
import VoiceRecorder from "@/components/interview/VoiceRecorder";
import { getRoleLabel, getLevelLabel, getRoleById } from "@/lib/roles";
import { ArrowRight, Volume2, VolumeX, Loader2, Send, BrainCircuit } from "lucide-react";

interface Question {
  id: string;
  content: string;
  orderIndex: number;
  answer: { id: string } | null;
}

interface Session {
  id: string;
  role: string;
  level: string;
  status: string;
  questions: Question[];
}

interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  overallComment: string;
}

export default function InterviewPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    fetchSession();
  }, []);

  useEffect(() => {
    if (session && voiceEnabled) {
      speakQuestion(session.questions[currentIndex]?.content ?? "");
    }
  }, [currentIndex, session]);

  async function fetchSession() {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (!res.ok) throw new Error("Session not found");
      const data: Session = await res.json();
      const firstUnanswered = data.questions.findIndex((q) => !q.answer);
      setCurrentIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
      setSession(data);
    } catch {
      setError("Could not load interview session.");
    } finally {
      setLoading(false);
    }
  }

  function speakQuestion(text: string) {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    synthRef.current.speak(utterance);
  }

  function toggleVoice() {
    if (voiceEnabled) {
      synthRef.current?.cancel();
    } else if (session) {
      speakQuestion(session.questions[currentIndex]?.content ?? "");
    }
    setVoiceEnabled(!voiceEnabled);
  }

  async function submitAnswer() {
    if (!answer.trim() || !session) return;
    setSubmitting(true);
    setError("");

    try {
      const currentQuestion = session.questions[currentIndex];
      const res = await fetch(`/api/sessions/${sessionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: currentQuestion.id, content: answer }),
      });

      if (!res.ok) throw new Error("Failed to submit answer");

      const data = await res.json();
      setFeedback(data.feedback as Feedback);

      if (data.isComplete) {
        setTimeout(() => router.push(`/interview/${sessionId}/results`), 2000);
      }
    } catch {
      setError("Failed to submit answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function nextQuestion() {
    setFeedback(null);
    setAnswer("");
    const nextIndex = currentIndex + 1;
    if (nextIndex >= (session?.questions.length ?? 0)) {
      router.push(`/interview/${sessionId}/results`);
    } else {
      setCurrentIndex(nextIndex);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center glow pulse-glow">
          <BrainCircuit className="h-7 w-7 text-white" />
        </div>
        <p className="text-muted-foreground font-medium">Loading your interview...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!session) return null;

  const currentQuestion = session.questions[currentIndex];
  const totalQuestions = session.questions.length;
  const progress = ((currentIndex + (feedback ? 1 : 0)) / totalQuestions) * 100;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const roleData = getRoleById(session.role);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                {roleData?.icon} {getRoleLabel(session.role)}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">{getLevelLabel(session.level)}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground tabular-nums">
                {currentIndex + 1} of {totalQuestions}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={toggleVoice}
                title={voiceEnabled ? "Mute AI voice" : "Enable AI voice"}
              >
                {voiceEnabled ? (
                  <Volume2 className="h-4 w-4 text-primary" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2.5 rounded-full" />
          <div className="flex justify-between mt-2">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`text-xs font-medium ${
                  i < currentIndex
                    ? "text-primary"
                    : i === currentIndex
                    ? "text-foreground"
                    : "text-muted-foreground/40"
                }`}
              >
                Q{i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6 border-primary/10 shadow-md overflow-hidden">
          <div className="h-1.5 gradient-bg" />
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-white text-sm font-bold">{currentIndex + 1}</span>
              </div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">
                Question {currentIndex + 1} of {totalQuestions}
              </p>
            </div>
            <p className="text-lg sm:text-xl font-medium leading-relaxed">{currentQuestion.content}</p>
          </CardContent>
        </Card>

        {/* Answer area */}
        {!feedback && (
          <div className="space-y-4 fade-in">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Your Answer</label>
              <VoiceRecorder
                onTranscript={(text) => setAnswer((prev) => prev + (prev ? " " : "") + text)}
                disabled={submitting}
              />
            </div>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here, or use the voice button to speak your response..."
              className="min-h-[180px] resize-none text-base border-2 focus:border-primary/50 rounded-xl"
              disabled={submitting}
            />
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {error}
              </div>
            )}
            <Button
              className="w-full gap-2 h-12 text-base gradient-bg border-0 text-white hover:opacity-90 transition-opacity"
              onClick={submitAnswer}
              disabled={!answer.trim() || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  AI is evaluating your answer...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Answer
                </>
              )}
            </Button>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="space-y-4 fade-in">
            <FeedbackCard
              score={feedback.score}
              strengths={feedback.strengths}
              improvements={feedback.improvements}
              overallComment={feedback.overallComment}
            />
            <Button
              className="w-full gap-2 h-12 text-base gradient-bg border-0 text-white hover:opacity-90 transition-opacity"
              onClick={nextQuestion}
            >
              {isLastQuestion ? "View Full Results" : "Next Question"}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
