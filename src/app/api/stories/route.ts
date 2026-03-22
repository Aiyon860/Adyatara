import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const stories = await db.story.findMany({
      include: {
        nodes: false,
        sessions: false,
        knowledges: false
      }
    });

    return NextResponse.json(stories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
