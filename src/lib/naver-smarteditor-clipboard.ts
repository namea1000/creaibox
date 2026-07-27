/**
 * Naver SmartEditor ONE HTML & Rich Text Clipboard Helper
 * 
 * Converts Markdown manuscript content (including title, headers, tables, bold, images, links, dividers, and source URLs)
 * into rich HTML formatted for Naver SmartEditor ONE when pasted (Ctrl+V).
 */

export interface CopyToNaverClipboardOptions {
  title?: string;
  content: string;
  originalContent?: string;
  sourceUrl?: string;
}

export function extractImagesFromContent(content: string): Array<{ url: string; alt: string }> {
  const images: Array<{ url: string; alt: string }> = [];
  if (!content) return images;

  // 1. Match Markdown images: ![alt](url)
  const mdMatches = Array.from(content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g));
  mdMatches.forEach((m) => {
    const alt = m[1] || "블로그 대표 이미지";
    const url = m[2];
    if (url && !images.some((i) => i.url === url)) {
      images.push({ alt, url });
    }
  });

  // 2. Match HTML img tags: <img ... src="url" ...>
  const htmlMatches = Array.from(content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi));
  htmlMatches.forEach((m) => {
    const url = m[1];
    if (url && !images.some((i) => i.url === url)) {
      const altMatch = /alt=["']([^"']+)["']/i.exec(m[0]);
      const alt = altMatch ? altMatch[1] : "블로그 이미지";
      images.push({ alt, url });
    }
  });

  return images;
}

export function injectImagesIntoMarkdown(content: string, originalContent?: string): string {
  if (!originalContent) return content;

  const originalImages = extractImagesFromContent(originalContent);
  if (originalImages.length === 0) return content;

  const currentImages = extractImagesFromContent(content);
  if (currentImages.length >= originalImages.length) return content;

  let result = content;
  const missingImages = originalImages.filter((img) => !currentImages.some((c) => c.url === img.url));
  if (missingImages.length === 0) return content;

  // 1. Insert 1st image (Hero image) right after top separator '---' or top section
  const heroImage = missingImages[0];
  const heroMd = `\n\n![${heroImage.alt}](${heroImage.url})\n\n`;

  if (result.includes("---")) {
    result = result.replace("---", `---${heroMd}`);
  } else {
    result = `${heroMd}${result}`;
  }

  // 2. Insert remaining images before '## ' headings
  let imgIndex = 1;
  result = result.replace(/^##\s+(.*$)/gim, (match, headingText) => {
    if (imgIndex < missingImages.length) {
      const img = missingImages[imgIndex++];
      return `\n\n![${img.alt}](${img.url})\n\n## ${headingText}`;
    }
    return match;
  });

  return result;
}

export async function copyToNaverSmartEditorClipboard({
  title,
  content: rawContent,
  originalContent,
  sourceUrl,
}: CopyToNaverClipboardOptions): Promise<boolean> {
  if (!rawContent && !title) return false;

  let processedContent = rawContent;

  // 🌟 Inject original post URL right before the hashtag line for Naver link card preview
  if (sourceUrl) {
    const cleanUrl = sourceUrl.trim();
    if (cleanUrl && !processedContent.includes(cleanUrl)) {
      const hashtagMatch = processedContent.match(/^#[^\s#].*$/m);
      if (hashtagMatch) {
        processedContent = processedContent.replace(/^#[^\s#].*$/m, `${cleanUrl}\n\n${hashtagMatch[0]}`);
      } else {
        processedContent = `${processedContent}\n\n${cleanUrl}`;
      }
    }
  }

  // Ensure images from original post are embedded if missing
  const contentWithImages = injectImagesIntoMarkdown(processedContent, originalContent);

  const rawMarkdown = title ? `# ${title}\n\n${contentWithImages}` : contentWithImages;

  let html = rawMarkdown;

  // Convert Headings
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size: 18px; font-weight: 700; color: #111827; margin-top: 28px; margin-bottom: 12px; line-height: 1.5;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 36px; margin-bottom: 16px; line-height: 1.4;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="font-size: 26px; font-weight: 900; color: #0f172a; margin-top: 40px; margin-bottom: 20px; line-height: 1.3;">$1</h1>');

  // Convert Dividers / Horizontal Rules
  html = html.replace(/^---$/gim, '<p><br></p><hr style="border: none; border-top: 2px dashed #cbd5e1; margin: 32px 0;" /><p><br></p>');

  // Convert Images: ![alt](url) -> Naver SmartEditor ONE centered image format
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
    const cleanAlt = alt || "블로그 대표 이미지";
    return `<p align="center" style="text-align: center; margin: 28px 0;"><img src="${url}" alt="${cleanAlt}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); display: inline-block;" /><br /><span style="font-size: 13px; color: #64748b; margin-top: 8px; display: inline-block; font-weight: 500;">${cleanAlt}</span></p><p><br></p>`;
  });

  // Convert Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #0284c7; font-weight: 600; text-decoration: underline;">${text}</a>`;
  });

  // Convert standalone URLs (e.g. https://creaibox.com/blog/...)
  html = html.replace(/(^|\n)(https?:\/\/[^\s<]+)/g, (_match, prefix, url) => {
    return `${prefix}<p style="margin: 24px 0;"><a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #0284c7; font-weight: 600; text-decoration: underline;">${url}</a></p><p><br></p>`;
  });

  // Convert Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Convert Bullet lists
  html = html.replace(/^\* (.*$)/gim, '<li style="margin-left: 20px; list-style-type: disc; margin-bottom: 8px; font-size: 15px; color: #334155;">$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li style="margin-left: 20px; list-style-type: disc; margin-bottom: 8px; font-size: 15px; color: #334155;">$1</li>');
  html = html.replace(/((?:<li[^>]*>.*<\/li>\s*)+)/g, '<ul style="margin: 20px 0; padding-left: 10px;">$1</ul><p><br></p>');

  // Convert Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote style="border-left: 4px solid #0284c7; padding: 14px 18px; margin: 24px 0; background-color: #f0f9ff; color: #0369a1; font-size: 15px; border-radius: 0 8px 8px 0;">$1</blockquote><p><br></p>');

  // Convert Markdown Tables
  html = html.replace(/((?:(?:^|\n)\|[^\n]+\|\s*)+)/g, (match) => {
    const rawLines = match.trim().split("\n").map((l) => l.trim()).filter(Boolean);
    if (rawLines.length < 2) return match;

    let headerRow: string[] = [];
    let alignment: string[] = [];
    const bodyRows: string[][] = [];

    rawLines.forEach((line, index) => {
      if (!line.includes("|")) return;
      const cells = line
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim());

      const isSeparator = cells.every((c) => /^:?-+:?$/.test(c.replace(/\s+/g, "")));

      if (isSeparator) {
        alignment = cells.map((c) => {
          const s = c.replace(/\s+/g, "");
          if (s.startsWith(":") && s.endsWith(":")) return "center";
          if (s.endsWith(":")) return "right";
          return "left";
        });
      } else if (index === 0 || (headerRow.length === 0 && !isSeparator)) {
        headerRow = cells;
      } else {
        bodyRows.push(cells);
      }
    });

    if (headerRow.length === 0) return match;

    let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 28px 0; font-size: 14px; line-height: 1.6; border: 1px solid #cbd5e1; background-color: #ffffff;">\n`;
    tableHtml += `  <thead>\n    <tr style="background-color: #f1f5f9;">\n`;
    headerRow.forEach((hCell, i) => {
      const align = alignment[i] || "left";
      tableHtml += `      <th style="border: 1px solid #cbd5e1; padding: 12px 16px; font-weight: 800; color: #0f172a; text-align: ${align}; background-color: #e2e8f0;">${hCell}</th>\n`;
    });
    tableHtml += `    </tr>\n  </thead>\n`;

    tableHtml += `  <tbody>\n`;
    bodyRows.forEach((row, rowIndex) => {
      const bg = rowIndex % 2 === 1 ? "#f8fafc" : "#ffffff";
      tableHtml += `    <tr style="background-color: ${bg};">\n`;
      row.forEach((bCell, i) => {
        const align = alignment[i] || "left";
        tableHtml += `      <td style="border: 1px solid #cbd5e1; padding: 10px 16px; color: #334155; text-align: ${align}; font-weight: 500;">${bCell}</td>\n`;
      });
      tableHtml += `    </tr>\n`;
    });
    tableHtml += `  </tbody>\n</table><p><br></p>`;

    return `\n\n${tableHtml}\n\n`;
  });

  // Split into paragraphs by double newlines & add <p><br></p> gaps for Naver SmartEditor
  const paragraphBlocks = html
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        /^(<h[1-6]|<hr|<div|<ul|<ol|<blockquote|<table|<p)/i.test(trimmed)
      ) {
        return trimmed;
      }
      if (/^#[^\s#]/.test(trimmed)) {
        return `<p style="font-size: 15px; font-weight: 700; color: #475569; margin-top: 32px; margin-bottom: 20px; word-break: break-word;">${trimmed}</p>`;
      }

      const withBr = trimmed.replace(/\n/g, "<br />");
      return `<p style="font-size: 16px; line-height: 1.85; color: #1e293b; margin-bottom: 20px; word-break: break-word;">${withBr}</p>`;
    })
    .filter(Boolean);

  const fullBodyHtml = paragraphBlocks.join("\n<p><br></p>\n");

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; color: #1e293b;">
${fullBodyHtml}
</body>
</html>`;

  const plainText = rawMarkdown;

  try {
    if (typeof window !== "undefined" && navigator.clipboard && typeof ClipboardItem !== "undefined") {
      const htmlBlob = new Blob([fullHtml], { type: "text/html" });
      const textBlob = new Blob([plainText], { type: "text/plain" });

      const clipboardItem = new ClipboardItem({
        "text/html": htmlBlob,
        "text/plain": textBlob,
      });

      await navigator.clipboard.write([clipboardItem]);
      return true;
    }
  } catch (err) {
    console.warn("ClipboardItem write failed, fallback to plain text copy:", err);
  }

  try {
    await navigator.clipboard.writeText(plainText);
    return true;
  } catch (fallbackErr) {
    console.error("Clipboard copy failed completely:", fallbackErr);
    return false;
  }
}
