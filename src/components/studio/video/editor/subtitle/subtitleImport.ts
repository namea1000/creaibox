export type SubtitleImportCue = {
  startTime: number;
  endTime: number;
  text: string;
};

function parseTimestamp(value: string) {
  const normalized = value.trim().replace(",", ".");
  const parts = normalized.split(":").map(Number);

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  return Number.NaN;
}

function cleanSubtitleText(lines: string[]) {
  return lines
    .map((line) =>
      line
        .replace(/<[^>]+>/g, "")
        .replace(/\{\\[^}]+\}/g, "")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean)
    .join("\n");
}

export function parseSubtitleText(source: string): SubtitleImportCue[] {
  const normalized = source
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/^WEBVTT[^\n]*\n+/i, "")
    .trim();

  if (!normalized) return [];

  const blocks = normalized.split(/\n{2,}/);
  const cues: SubtitleImportCue[] = [];

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const timeIndex = lines.findIndex((line) => line.includes("-->"));
    if (timeIndex < 0) continue;

    const [rawStart, rawEnd] = lines[timeIndex].split("-->").map((part) =>
      part.trim().split(/\s+/)[0]
    );
    const startTime = parseTimestamp(rawStart);
    const endTime = parseTimestamp(rawEnd);
    if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) continue;
    if (endTime <= startTime) continue;

    const text = cleanSubtitleText(lines.slice(timeIndex + 1));
    if (!text) continue;

    cues.push({
      startTime: Number(startTime.toFixed(3)),
      endTime: Number(endTime.toFixed(3)),
      text,
    });
  }

  return cues.sort((a, b) => a.startTime - b.startTime);
}
