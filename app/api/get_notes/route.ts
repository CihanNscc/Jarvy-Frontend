import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("user_database");

    const result = await db.collection("notes").find({}).toArray();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Failed to add note:", error);
    return NextResponse.json({ error: "Failed to get notes" }, { status: 500 });
  }
}
