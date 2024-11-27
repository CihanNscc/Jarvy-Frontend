import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const { _id } = await request.json();

    const client = await clientPromise;
    const db = client.db("user_database");

    const result = await db
      .collection("notes")
      .deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to delete the note:", error);
    return NextResponse.json(
      { error: "Error deleting the note" },
      { status: 500 }
    );
  }
}
