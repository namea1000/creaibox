import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extract the first valid JSON object string from a text, supporting nested braces and quotes.
 * Uses regex to find the starting brace followed by double quote or closing brace.
 */
export function extractJsonString(text: string): string {
  const startIdx = text.search(/\{\s*["}]/);
  if (startIdx === -1) return text;

  let braceCount = 0;
  let inString = false;
  let escaped = false;

  for (let i = startIdx; i < text.length; i++) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === "{") {
        braceCount++;
      } else if (char === "}") {
        braceCount--;
        if (braceCount === 0) {
          return text.substring(startIdx, i + 1);
        }
      }
    }
  }

  return text.substring(startIdx);
}

/**
 * Robustly parses a JSON string that may contain markdown wrapper blocks, leading/trailing comments,
 * desynchronized quotes, or other formatting issues.
 */
export function robustParseJson(text: string): any {
  let cleaned = text.trim();

  // 1. Try to extract JSON from markdown code block if present
  const codeBlockMatch = cleaned.match(/```json\s*([\s\S]*?)\s*```/) || cleaned.match(/```\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    const codeBlockContent = codeBlockMatch[1].trim();
    try {
      return JSON.parse(codeBlockContent);
    } catch {
      cleaned = codeBlockContent;
    }
  }

  // 2. Try parsing directly
  try {
    return JSON.parse(cleaned);
  } catch (error: any) {
    // 3. Try brace matching extraction
    const extracted = extractJsonString(cleaned);
    try {
      return JSON.parse(extracted);
    } catch (innerError: any) {
      // 4. Try parsing error position from the error messages (V8 format: "... at position 1234")
      const match = error.message?.match(/at position (\d+)/) || innerError.message?.match(/at position (\d+)/);
      if (match) {
        const pos = parseInt(match[1], 10);
        try {
          const targetStr = error.message?.includes("at position") ? cleaned : extracted;
          return JSON.parse(targetStr.slice(0, pos));
        } catch {
          // fall through
        }
      }

      // 5. Fallback: search backwards for braces
      const firstBrace = cleaned.search(/\{\s*["}]/);
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace >= 0 && lastBrace > firstBrace) {
        try {
          return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
        } catch {
          // fall through
        }
      }

      throw new Error("AI 응답을 JSON으로 변환하지 못했습니다.");
    }
  }
}

