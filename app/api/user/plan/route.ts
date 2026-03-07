import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ plan: "free" });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { plan: true, name: true, email: true },
    });

    return NextResponse.json({ plan: user?.plan ?? "free", name: user?.name, email: user?.email });
  } catch {
    return NextResponse.json({ plan: "free" });
  }
}
