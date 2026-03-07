import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSessionSummary } from "@/lib/claude";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await params;

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const session = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId: user.id },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
        include: {
          answer: {
            include: { feedback: true },
          },
        },
      },
    },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // Generate AI summary if session is complete
  let summary = null;
  if (session.status === "completed") {
    const scores = session.questions
      .map((q) => q.answer?.feedback?.score ?? 0)
      .filter((s) => s > 0);

    if (scores.length > 0) {
      summary = await generateSessionSummary(session.role, session.level, scores);
    }
  }

  // Parse JSON strings back to arrays
  const questions = session.questions.map((q) => ({
    ...q,
    answer: q.answer
      ? {
          ...q.answer,
          feedback: q.answer.feedback
            ? {
                ...q.answer.feedback,
                strengths: JSON.parse(q.answer.feedback.strengths) as string[],
                improvements: JSON.parse(q.answer.feedback.improvements) as string[],
              }
            : null,
        }
      : null,
  }));

  return NextResponse.json({
    session: { ...session, questions },
    summary,
  });
}
