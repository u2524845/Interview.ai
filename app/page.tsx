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
  Sparkles,
  Zap,
  Users,
  TrendingUp,
  Check,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Questions",
    description:
      "Claude AI generates role-specific questions matched to your experience level for realistic practice.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Mic,
    title: "Voice & Text Mode",
    description:
      "Speak your answers naturally with voice recording or type them out. Just like a real interview.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Instant Scoring",
    description:
      "Get scored 1-10 on every answer with detailed strengths, improvement areas, and expert tips.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description:
      "See how your scores improve over time with your personal dashboard and session history.",
    gradient: "from-amber-500 to-orange-500",
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
  { step: "01", title: "Pick Your Role", desc: "Choose from 6+ job roles and select your experience level", icon: Users },
  { step: "02", title: "Answer Questions", desc: "Respond to 5 AI-generated questions by voice or text", icon: Mic },
  { step: "03", title: "Get AI Feedback", desc: "Receive detailed scores, strengths, and improvement tips", icon: Sparkles },
  { step: "04", title: "Level Up", desc: "Track your improvement and practice until you're interview-ready", icon: Zap },
];

const stats = [
  { value: "10K+", label: "Interviews Completed" },
  { value: "4.9/5", label: "User Rating" },
  { value: "87%", label: "Got Hired Faster" },
  { value: "6+", label: "Job Roles" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 pt-20 pb-28 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl -z-10" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-purple-200/30 dark:bg-purple-600/10 blur-3xl -z-10" />
        <div className="absolute top-40 left-0 w-[300px] h-[300px] rounded-full bg-blue-200/20 dark:bg-blue-600/10 blur-3xl -z-10" />

        <div className="fade-in">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium gap-1.5 border border-primary/20 bg-primary/5 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Your first interview is free
          </Badge>
        </div>

        <h1 className="slide-up text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
          Ace Your Next
          <br />
          <span className="gradient-text">Interview with AI</span>
        </h1>

        <p className="slide-up text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Practice with AI-powered mock interviews tailored to your role.
          Get instant feedback, improve your answers, and land your dream job.
        </p>

        <div className="slide-up">
          <HeroButtons />
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto fade-in">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="gradient-bg-subtle py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to
              <span className="gradient-text"> nail your interview</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our AI interviewer simulates real interview scenarios so you can practice with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <Card key={f.title} className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <Badge variant="outline" className="mb-4 text-primary border-primary/20">Supported Roles</Badge>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Practice for <span className="gradient-text">your exact role</span>
        </h2>
        <p className="text-muted-foreground mb-12 max-w-lg mx-auto">
          Questions tailored to your specific job title and experience level.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {roles.map((r) => (
            <div
              key={r.label}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl border bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
            >
              <span className="text-2xl">{r.icon}</span>
              <span className="font-medium">{r.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="gradient-bg-subtle py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text">Four simple steps</span> to interview mastery
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 glow-sm">
                  <s.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-xs font-bold text-primary mb-2 tracking-widest">{s.step}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-4 py-24" id="pricing">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">Pricing</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start free, <span className="gradient-text">upgrade when ready</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Try your first mock interview completely free. Upgrade for unlimited practice.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card className="border-2 border-border shadow-md">
            <CardContent className="p-8">
              <h3 className="font-semibold text-lg mb-1">Free</h3>
              <p className="text-sm text-muted-foreground mb-6">Try it out, no card needed</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-muted-foreground ml-1">/ forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["1 complete mock interview", "5 AI-generated questions", "Instant AI feedback & scoring", "Voice & text input"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary shadow-xl glow relative overflow-hidden">
            <div className="absolute top-0 right-0 gradient-bg text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
            <CardContent className="p-8">
              <h3 className="font-semibold text-lg mb-1">Pro</h3>
              <p className="text-sm text-muted-foreground mb-6">Unlimited practice to get hired</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$9</span>
                <span className="text-muted-foreground ml-1">/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Unlimited mock interviews", "All 6+ job roles", "Detailed AI feedback & scoring", "Voice & text input", "Full session history & analytics", "Priority AI processing"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button className="w-full gradient-bg border-0 hover:opacity-90 transition-opacity">
                  Start Pro Trial
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="absolute inset-0 gradient-bg opacity-95" />
        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Your dream job is one practice session away
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of professionals who improved their interview skills and landed offers faster.
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="text-base px-10 gap-2 font-semibold shadow-lg hover:shadow-xl transition-all">
              Start Your Free Interview
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">Interview.ai</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <span>Built with Claude AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Interview.ai
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
