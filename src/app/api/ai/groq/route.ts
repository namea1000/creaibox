import { NextResponse } from "next/server";
import { generateGroqText } from "@/lib/ai/groq";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "prompt가 필요합니다." },
        { status: 400 }
      );
    }

    const result = await generateGroqText(prompt);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Groq API Error:", error);

    return NextResponse.json(
      { error: "Groq 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}