import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateAnswer } from "@/lib/claude";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await params;
  const { questionId, content } = await req.json();

  if (!questionId || !content?.trim()) {
    return NextResponse.json({ error: "questionId and content are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Verify ownership
  const question = await prisma.question.findFirst({
    where: { id: questionId, session: { id: sessionId, userId: user.id } },
    include: { session: true },
  });

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  // Get AI feedback
  const feedbackResult = await evaluateAnswer(
    question.session.role,
    question.session.level,
    question.content,
    content
  );

  // Save answer + feedback
  const answer = await prisma.answer.create({
    data: {
      questionId,
      content,
      feedback: {
        create: {
          score: feedbackResult.score,
          strengths: JSON.stringify(feedbackResult.strengths),
          improvements: JSON.stringify(feedbackResult.improvements),
          overallComment: feedbackResult.overallComment,
        },
      },
    },
    include: { feedback: true },
  });

  // Check if all questions are answered — if so, finalize session
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      questions: {
        include: { answer: { include: { feedback: true } } },
      },
    },
  });

  const allAnswered = session?.questions.every((q: { answer: unknown }) => q.answer !== null);

  if (allAnswered && session) {
    const scores = session.questions
      .map((q) => q.answer?.feedback?.score ?? 0)
      .filter((s) => s > 0);
    const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        status: "completed",
        overallScore,
        completedAt: new Date(),
      },
    });
  }

  return NextResponse.json({
    answerId: answer.id,
    feedback: {
      score: feedbackResult.score,
      strengths: feedbackResult.strengths,
      improvements: feedbackResult.improvements,
      overallComment: feedbackResult.overallComment,
    },
    isComplete: allAnswered,
  });
}
