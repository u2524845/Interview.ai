"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import FeedbackCard from "@/components/interview/FeedbackCard";
import VoiceRecorder from "@/components/interview/VoiceRecorder";
import { getRoleLabel, getLevelLabel } from "@/lib/roles";
import { ArrowRight, Volume2, VolumeX, Loader2, MicOff } from "lucide-react";

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

      // Find first unanswered question
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
        // Redirect to results after a short delay
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {getRoleLabel(session.role)}
              </Badge>
              <Badge variant="outline">{getLevelLabel(session.level)}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {totalQuestions}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleVoice}
                title={voiceEnabled ? "Mute AI voice" : "Enable AI voice"}
              >
                {voiceEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <div className="mb-6 p-6 rounded-xl bg-muted/40 border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Question {currentIndex + 1}
          </p>
          <p className="text-lg font-medium leading-relaxed">{currentQuestion.content}</p>
        </div>

        {/* Answer area */}
        {!feedback && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Your Answer</label>
              <VoiceRecorder
                onTranscript={(text) => setAnswer((prev) => prev + (prev ? " " : "") + text)}
                disabled={submitting}
              />
            </div>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here, or use the voice button to speak..."
              className="min-h-[160px] resize-none"
              disabled={submitting}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button
              className="w-full gap-2"
              onClick={submitAnswer}
              disabled={!answer.trim() || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Evaluating Answer...
                </>
              ) : (
                "Submit Answer"
              )}
            </Button>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="space-y-4">
            <FeedbackCard
              score={feedback.score}
              strengths={feedback.strengths}
              improvements={feedback.improvements}
              overallComment={feedback.overallComment}
            />
            {!isLastQuestion ? (
              <Button className="w-full gap-2" onClick={nextQuestion}>
                Next Question
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button className="w-full gap-2" onClick={nextQuestion}>
                View Full Results
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
