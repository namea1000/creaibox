import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1순위 의무화 규칙: gemini-3.1-flash-lite 사용
const MODEL_NAME = "gemini-3.1-flash-lite";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // 1. DB에서 원고 조회
    const { data: post, error: fetchError } = await supabase
      .from('writing_creaibox_posts')
      .select('*')
      .eq('id', postId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const rawTitle = post.original_title || post.title;
    const rawContent = post.original_content || post.content;

    if (!rawContent) {
       return NextResponse.json({ error: "No content to recreate" }, { status: 400 });
    }

    // Gemini 초기화
    const geminiKey = process.env.GEMINI_API_KEY_1 || "";
    if (!geminiKey) {
      return NextResponse.json({ error: "Gemini API key is missing" }, { status: 500 });
    }
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // 2. Unsplash 이미지 매칭을 위한 영문 키워드 추출
    let unsplashImageUrl = "";
    try {
      const keywordPrompt = `
      You are an expert photo editor. 
      Read the following article title and content. 
      Extract 1 to 3 highly descriptive English keywords that best represent the core subject to search for a highly relevant, high-quality stock photo on Unsplash. 
      Return ONLY the keywords separated by spaces (e.g., "business modern desk"). Do not output any other text or explanation.
      
      Title: ${rawTitle}
      Content: ${rawContent.substring(0, 1000)}...
      `;
      
      const keywordResult = await model.generateContent(keywordPrompt);
      const searchKeywords = keywordResult.response.text().trim();
      
      if (searchKeywords) {
        const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
        if (unsplashKey) {
          const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchKeywords)}&orientation=landscape&per_page=1&client_id=${unsplashKey}`);
          const unsplashData = await unsplashRes.json();
          if (unsplashData && unsplashData.results && unsplashData.results.length > 0) {
            unsplashImageUrl = unsplashData.results[0].urls.regular;
          }
        }
      }
    } catch (imageError) {
      console.error("Image Matching Error:", imageError);
      // 이미지가 없어도 재창조는 진행해야 하므로 에러 무시
    }

    // 3. AI 리라이팅 (재창조)
    let newTitle = rawTitle;
    let newContent = rawContent;

    try {
      const recreatePrompt = `
      You are an expert professional copywriter and SEO specialist.
      Rewrite the following Korean article completely.
      - Paraphrase and change the structure to avoid any plagiarism (유사문서 방지).
      - Make the tone highly professional, engaging, and easy to read.
      - Return the output in valid JSON format ONLY, without Markdown code blocks.
      - The JSON must have exactly two keys: "title" (the rewritten attractive title) and "content" (the rewritten content in clean HTML format, using <p>, <h2>, <h3>, <ul>, etc. where appropriate).
      
      Original Title: ${rawTitle}
      Original Content: ${rawContent}
      `;

      const recreateResult = await model.generateContent(recreatePrompt);
      let aiText = recreateResult.response.text().trim();
      
      // JSON 파싱 (안전을 위해 백틱 제거)
      if (aiText.startsWith('\`\`\`json')) {
         aiText = aiText.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
      } else if (aiText.startsWith('\`\`\`')) {
         aiText = aiText.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
      }

      const parsedData = JSON.parse(aiText);
      if (parsedData.title) newTitle = parsedData.title;
      if (parsedData.content) newContent = parsedData.content;
      
    } catch (rewriteError) {
      console.error("Rewrite Error:", rewriteError);
      return NextResponse.json({ error: "Failed to recreate content via AI" }, { status: 500 });
    }

    // 4. 최종 HTML 조립 (이미지가 있으면 최상단에 삽입)
    let finalHtml = newContent;
    if (unsplashImageUrl) {
      const imgTag = `<figure style="margin: 0 0 24px 0;"><img src="${unsplashImageUrl}" alt="${newTitle}" style="width: 100%; border-radius: 8px; object-fit: cover; aspect-ratio: 16/9;" /></figure>\n`;
      finalHtml = imgTag + newContent;
    }

    // 5. DB 업데이트 (상태를 'saved'로 변경하여 일반 보관함으로 이동)
    const { error: updateError } = await supabase
      .from('writing_creaibox_posts')
      .update({
        title: newTitle,
        content: finalHtml,
        status: 'saved'
      })
      .eq('id', postId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error("DB Update Error:", updateError);
      return NextResponse.json({ error: "Failed to update database" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Article recreated successfully" });

  } catch (error: any) {
    console.error("Recreate API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
