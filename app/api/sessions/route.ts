import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInterviewQuestions } from "@/lib/claude";
import { canStartInterview } from "@/lib/subscription";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, level } = await req.json();
    if (!role || !level) {
      return NextResponse.json({ error: "Role and level are required" }, { status: 400 });
    }

    // Ensure user exists in DB (created via Clerk webhook, but upsert as fallback)
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId, email: `${userId}@placeholder.com` },
    });

    // Check subscription limits
    const subscription = await canStartInterview(user.id);
    if (!subscription.allowed) {
      return NextResponse.json({
        error: "FREE_LIMIT_REACHED",
        message: "You've used your free interview. Upgrade to Pro for unlimited practice.",
        sessionsUsed: subscription.sessionsUsed,
        limit: subscription.limit,
      }, { status: 403 });
    }

    // Generate questions with Claude
    let questions: string[];
    try {
      questions = await generateInterviewQuestions(role, level);
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI service error";
      if (message.includes("credit balance")) {
        return NextResponse.json({ error: "AI service has no credits. Please contact the admin." }, { status: 503 });
      }
      return NextResponse.json({ error: message }, { status: 500 });
    }

    // Create session + questions in DB
    const session = await prisma.interviewSession.create({
      data: {
        userId: user.id,
        role,
        level,
        questions: {
          create: questions.map((content, index) => ({
            content,
            orderIndex: index,
          })),
        },
      },
      include: { questions: { orderBy: { orderIndex: "asc" } } },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error("[sessions] Unexpected error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database is unavailable. Please try again shortly." }, { status: 503 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
