import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get("file") as Blob;

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(process.cwd(), "public", "query.wav");

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return reject(new Response("Error uploading file", { status: 500 }));
      }
      resolve(NextResponse.json({ message: "File uploaded successfully" }));
    });
  });
}
