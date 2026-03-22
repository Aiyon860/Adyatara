import { auth } from "@/lib/auth";
import { getCurrentNode } from "@/lib/game-engine";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const sessionAuth = await auth();
    const user = sessionAuth?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;
    const { session, node } = await getCurrentNode(sessionId);

    if (session.userId !== user.id) {
        return NextResponse.json({ error: "Unauthorized session access" }, { status: 403 });
    }

    return NextResponse.json({ session, node });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
