import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { sourceId, storagePath } = await req.json();

    if (!sourceId || !storagePath) {
      return NextResponse.json(
        { error: "sourceId와 storagePath가 필요합니다." },
        { status: 400 }
      );
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("research-assets")
      .download(storagePath);

    if (downloadError || !fileData) {
      return NextResponse.json(
        { error: "PDF 파일 다운로드에 실패했습니다." },
        { status: 400 }
      );
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parser = new PDFParse({ data: buffer });

    const result = await parser.getText();

    const extractedText = result.text?.trim() || "";

    await parser.destroy();

    const { error: insertError } = await supabase
      .from("research_extractions")
      .insert({
        source_id: sourceId,
        user_id: user.id,
        extracted_title: "PDF 텍스트 추출 결과",
        extracted_text: extractedText,
        summary: "",
        meta: {
          page_count: result.total || 0,
          info: {},
          extracted_by: "extract-pdf-api",
        },
        images: [],
        char_count: extractedText.length,
        word_count: extractedText ? extractedText.split(/\s+/).length : 0,
        language: "ko",
      });

    if (insertError) throw insertError;

    const { error: updateError } = await supabase
      .from("research_sources")
      .update({
        status: "extracted",
      })
      .eq("id", sourceId)
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      ok: true,
      textLength: extractedText.length,
      pageCount: result.total || 0,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "PDF 추출 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}