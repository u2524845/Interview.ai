import { prisma } from "@/lib/prisma";

const FREE_SESSION_LIMIT = 1;

export async function canStartInterview(userId: string): Promise<{
  allowed: boolean;
  sessionsUsed: number;
  limit: number;
  isPro: boolean;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  const isPro = user?.plan === "pro";

  if (isPro) {
    return { allowed: true, sessionsUsed: 0, limit: Infinity, isPro: true };
  }

  const completedSessions = await prisma.interviewSession.count({
    where: { userId },
  });

  return {
    allowed: completedSessions < FREE_SESSION_LIMIT,
    sessionsUsed: completedSessions,
    limit: FREE_SESSION_LIMIT,
    isPro: false,
  };
}
