import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const sessionAuth = await auth();
    const user = sessionAuth?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
          level: true,
          totalScore: true,
          gameSessions: {
              where: { status: "completed" },
              select: {
                  id: true,
                  storyId: true,
                  score: true,
                  finishedAt: true
              }
          },
          userKnowledges: {
              include: {
                  knowledge: true
              }
          }
      }
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
