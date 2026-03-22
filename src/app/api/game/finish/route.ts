import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const sessionAuth = await auth();
    const user = sessionAuth?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId } = body;

    const session = await db.gameSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== user.id) {
      return NextResponse.json(
        { error: "Invalid session or unauthorized" },
        { status: 403 }
      );
    }

    if (session.status !== "active") {
        return NextResponse.json(
            { error: "Session already completed" },
            { status: 400 }
        );
    }

    const updatedSession = await db.gameSession.update({
        where: { id: sessionId },
        data: {
            status: "completed",
            finishedAt: new Date()
        }
    })

    // Additional cleanup logic or scoring adjustment here if aborted

    return NextResponse.json(updatedSession);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
