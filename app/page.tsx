import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import HeroButtons from "@/components/layout/HeroButtons";
import {
  BrainCircuit,
  Mic,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Generated Questions",
    description:
      "Claude AI crafts role-specific questions tailored to your experience level — from junior to senior.",
  },
  {
    icon: Mic,
    title: "Voice or Text Answers",
    description:
      "Answer using your microphone for a realistic interview feel, or type your responses at your own pace.",
  },
  {
    icon: BarChart3,
    title: "Instant AI Feedback",
    description:
      "Get scored on every answer with specific strengths, improvement tips, and an overall assessment.",
  },
  {
    icon: CheckCircle2,
    title: "Track Your Progress",
    description:
      "Your dashboard shows all past sessions so you can see how your scores improve over time.",
  },
];

const roles = [
  { icon: "💻", label: "Software Engineer" },
  { icon: "🖥️", label: "IT Support" },
  { icon: "📋", label: "Product Manager" },
  { icon: "📊", label: "Data Analyst" },
  { icon: "⚙️", label: "DevOps Engineer" },
  { icon: "🎨", label: "UX Designer" },
];

const steps = [
  { step: "1", title: "Choose Your Role", desc: "Pick your target job and experience level" },
  { step: "2", title: "Answer 5 Questions", desc: "Respond by voice or text, just like a real interview" },
  { step: "3", title: "Get AI Feedback", desc: "Receive scores, strengths, and tips after each answer" },
  { step: "4", title: "Improve & Repeat", desc: "Track progress and keep practicing until you're ready" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          <Star className="h-3 w-3 mr-1" />
          Free to start — no credit card required
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Practice Interviews.
          <br />
          <span className="text-primary">Get Hired Faster.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          AI-powered mock interviews with instant feedback. Practice anytime,
          improve your answers, and walk into your next interview with
          confidence.
        </p>
        <HeroButtons />
      </section>

      {/* Features */}
      <section className="bg-muted/40 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to ace your interview
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <f.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Practice for your exact role</h2>
        <p className="text-muted-foreground mb-10">
          Questions tailored to your specific job title and experience level
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {roles.map((r) => (
            <Badge
              key={r.label}
              variant="outline"
              className="text-base px-4 py-2 gap-2"
            >
              <span>{r.icon}</span>
              {r.label}
            </Badge>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/40 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to start practicing?</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Join thousands of job seekers improving their interview skills with AI.
        </p>
        <HeroButtons />
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <BrainCircuit className="h-4 w-4 text-primary" />
            InterviewAI
          </div>
          <p>© {new Date().getFullYear()} InterviewAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
