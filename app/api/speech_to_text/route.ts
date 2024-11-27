import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const uploadedAudioFilePath = path.resolve("./public/query.wav");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(uploadedAudioFilePath, buffer);

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      language: "en",
      file: fs.createReadStream(uploadedAudioFilePath),
      response_format: "json",
    });

    return NextResponse.json({ transcription: transcription.text });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio." },
      { status: 500 }
    );
  }
}
