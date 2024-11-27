import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE() {
  const folderPath = path.join(process.cwd(), "public", "response");

  try {
    const files = await fs.promises.readdir(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fileStat = await fs.promises.stat(filePath);

      if (fileStat.isFile()) {
        await fs.promises.unlink(filePath);
      }
    }

    return NextResponse.json({
      success: true,
      message: "All files deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting files:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete files" },
      { status: 500 }
    );
  }
}
