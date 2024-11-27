import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { note } = await req.json();
    const client = await clientPromise;
    const db = client.db("user_database");

    const result = await db.collection("notes").insertOne({ note });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Failed to add note:", error);
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
  }
}
