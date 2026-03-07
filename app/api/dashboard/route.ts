import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ sessions: [] });

  const sessions = await prisma.interviewSession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      role: true,
      level: true,
      status: true,
      overallScore: true,
      createdAt: true,
      completedAt: true,
      _count: { select: { questions: true } },
    },
  });

  return NextResponse.json({ sessions });
}
