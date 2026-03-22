import { auth } from "@/lib/auth";
import { startGame } from "@/lib/game-engine";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const sessionAuth = await auth();
    const user = sessionAuth?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { storyId } = body;

    if (!storyId) {
      return NextResponse.json({ error: "Missing storyId" }, { status: 400 });
    }

    const session = await startGame(user.id, storyId);
    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
