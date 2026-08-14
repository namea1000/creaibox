import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { createAdminClient } from "@/utils/supabase/server";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

async function processHtmlImagesWithR2(html: string, siteId: string, origin: string): Promise<string> {
  if (!html) return html;
  
  let newHtml = html;
  newHtml = newHtml.replace(/src=["'](\/[^"']+)["']/gi, `src="${origin}$1"`);
  newHtml = newHtml.replace(/url\(["']?(\/[^"')]*)["']?\)/gi, `url('${origin}$1')`);
  newHtml = newHtml.replace(/src=["'](?!(?:http|data:)|\/)([^"']+\.(?:png|jpe?g|gif|svg|webp))["']/gi, `src="${origin}/$1"`);

  const urlRegex = /https?:\/\/[^\s"'()]+/g;
  const urls = newHtml.match(urlRegex) || [];
  const uniqueUrls = Array.from(new Set(urls)).filter(u => u.match(/\.(jpeg|jpg|gif|png|svg|webp)/i) || u.includes("images.unsplash.com") || u.includes("drive.google.com"));

  const uploadPromises = uniqueUrls.map(async (url) => {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) return;
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const fileName = url.split('/').pop()?.split('?')[0] || `img_${Date.now()}.jpg`;
      const contentType = res.headers.get("content-type") || "image/jpeg";

      let finalBuffer: any = buffer;
      let finalContentType = contentType;
      let finalFileName = fileName;
      
      if (contentType.includes("image") && !contentType.includes("svg")) {
        try {
          finalBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
          finalContentType = "image/webp";
          finalFileName = fileName.replace(/\.[^/.]+$/, "") + ".webp";
        } catch (err) {
          console.warn(`Sharp WebP conversion failed for ${url}, falling back to original:`, err);
        }
      }
      
      const s3Key = `migrated-sites/${siteId}/${Date.now()}_${finalFileName}`;

      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME || 'creaibox-assets',
        Key: s3Key,
        Body: finalBuffer as any,
        ContentType: finalContentType,
      }));

      const newUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${s3Key}`;
      newHtml = newHtml.split(url).join(newUrl);
    } catch (e) {
      console.error(`Failed to upload ${url} to R2:`, e);
    }
  });

  await Promise.all(uploadPromises);
  return newHtml;
}

export async function GET(request: Request) {
  // CRON 보안 설정
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log("CRON_SECRET mismatch in site-migration-worker");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminSupabase = await createAdminClient();

  // Find one site that is migrating
  const { data: activeSites } = await adminSupabase
    .from("client_sites")
    .select("id, brand_id, custom_domain, extra_configs")
    .eq("status", "ACTIVE")
    .limit(20);

  if (!activeSites || activeSites.length === 0) {
    return NextResponse.json({ message: "No active sites found" });
  }

  const siteToProcess = activeSites.find(site => 
    site.extra_configs?.migration_status === "migrating" && 
    Array.isArray(site.extra_configs?.migration_queue) &&
    site.extra_configs.migration_queue.length > 0
  );

  if (!siteToProcess) {
    return NextResponse.json({ message: "No pending subpages in queue" });
  }

  const siteId = siteToProcess.id;
  const queue: string[] = siteToProcess.extra_configs.migration_queue;
  const targetPath = queue[0];
  const remainingQueue = queue.slice(1);
  const isCompleted = remainingQueue.length === 0;

  console.log(`[Worker] Processing subpage ${targetPath} for site ${siteId}. Remaining: ${remainingQueue.length}`);

  try {
    const originalUrl = siteToProcess.extra_configs?.original_url || `https://${siteToProcess.brand_id}.com`;
    const urlObj = new URL(originalUrl);
    
    const res = await fetch(`${urlObj.origin}${targetPath}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (res.ok) {
      const htmlText = await res.text();
      const cleanHtml = htmlText
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
        .replace(/<!--[\s\S]*?-->/g, "");

      // 2. Deep Migration with Gemini 3.5 Flash Lite
      const { generateContentWithVertexAI } = await import("@/lib/server/vertex-ai-gemini");
      const slug = targetPath.replace(/\//g, "").toLowerCase() || "page";
      
      const prompt = `
        You are an expert Frontend Developer and Designer. Your task is to extract and clone the MAIN CONTENT body of the provided subpage HTML using modern Tailwind CSS HTML.
        Ignore the header and footer, focus ONLY on the unique content of this subpage.
        
        You MUST output a strict JSON object with the following schema:
        {
          "html": "<main class='...'>...</main>"
        }

        Guidelines:
        - PRO-CLONING RULE 1 (Colors & Identity): Extract EXACT HEX color codes.
        - PRO-CLONING RULE 2 (NO OMISSION): DO NOT summarize or omit text. Extract all content verbatim.
        - CRITICAL: All image URLs MUST be ABSOLUTE URLs.
        - Output ONLY valid JSON.
        
        HTML content to analyze:
        ${cleanHtml.substring(0, 150000)}
      `;

      const aiText = await generateContentWithVertexAI({ 
        prompt, 
        modelName: "gemini-3.7-flash",
        responseMimeType: "application/json"
      });
      let parsedAi = { html: "" };
      try {
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedAi = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("Worker Gemini JSON Parse Error:", e);
      }

      let subHtml = parsedAi.html || "";
      subHtml = await processHtmlImagesWithR2(subHtml, siteId, urlObj.origin);

      const { data: existingSections } = await adminSupabase
        .from("site_sections")
        .select("sort_order")
        .eq("site_id", siteId)
        .order("sort_order", { ascending: false })
        .limit(1);
        
      const nextSortOrder = (existingSections && existingSections.length > 0) ? existingSections[0].sort_order + 1 : 10;

      await adminSupabase.from("site_sections").insert({
        site_id: siteId,
        section_type: `subpage_${slug}`,
        sort_order: nextSortOrder,
        title: slug,
        subtitle: "",
        content_data: { html: subHtml, page_slug: slug }
      });
    }

  } catch (error) {
    console.error(`[Worker] Error processing subpage ${targetPath}:`, error);
  }

  // 4. Update the Queue status
  await adminSupabase.from("client_sites").update({
    extra_configs: {
      ...siteToProcess.extra_configs,
      migration_queue: remainingQueue,
      migration_status: isCompleted ? "completed" : "migrating"
    }
  }).eq("id", siteId);

  return NextResponse.json({ 
    message: "Processed 1 subpage", 
    siteId, 
    path: targetPath, 
    remaining: remainingQueue.length 
  });
}
