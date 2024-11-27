import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const responseAudioFilePath = path.resolve(
    `./public/response/${Date.now()}.mp3`
  );
  const { text } = await req.json();

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "fable",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(responseAudioFilePath, buffer);

    const stats = await fs.promises.stat(responseAudioFilePath);
    if (stats.size === 0) {
      throw new Error("Generated audio file is empty.");
    }

    return NextResponse.json({
      responseAudioFilePath: `/response/${path.basename(
        responseAudioFilePath
      )}`,
    });
  } catch (error) {
    console.error("Error generating response audio:", error);
    return NextResponse.json(
      { error: "Failed to generate response audio." },
      { status: 500 }
    );
  }
}
