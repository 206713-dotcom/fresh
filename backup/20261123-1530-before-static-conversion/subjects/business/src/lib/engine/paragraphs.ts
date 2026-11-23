/**
 * Splits a candidate essay into logical paragraphs, merging standalone short headings
 * (e.g. "Recommendation", "Conclusion:") with their following paragraph body.
 */
export function splitEssayParagraphs(answer: string): string[] {
  const doubleNewlineBlocks = answer
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const rawBlocks =
    doubleNewlineBlocks.length >= 2
      ? doubleNewlineBlocks
      : answer
          .split(/\n+/)
          .map((p) => p.trim())
          .filter(Boolean);

  const merged: string[] = [];
  for (let i = 0; i < rawBlocks.length; i++) {
    const block = rawBlocks[i];
    const words = block.split(/\s+/).filter(Boolean).length;
    const isShortHeading =
      words <= 5 &&
      i + 1 < rawBlocks.length &&
      (/^(?:recommendation|conclusion|summary|option\s*\d+|method\s*\d+|choice|final\s+decision)\b/i.test(block) ||
        /:$/.test(block));

    if (isShortHeading) {
      merged.push(`${block}\n${rawBlocks[i + 1]}`);
      i++;
    } else {
      merged.push(block);
    }
  }
  return merged;
}

const CONCLUSION_HEADING_START_REGEX =
  /^(?:recommendation|conclusion|in conclusion|to conclude|to sum up|in summary|overall|on balance|ultimately|summary|final\s+decision|choice)\b/i;

const POINT_LABEL_PREFIX_REGEX =
  /^(?:(?:\(\d{1,2}\)|\d{1,2}[.)])\s+|(?:point|reason|benefit|advantage|disadvantage|drawback|limitation|factor|method|way|option)\s*\d{1,2}\s*[:.-]\s+)/i;

/**
 * Splits a student response into independent evaluable point/paragraph segments by:
 * - paragraph/newline breaks (merging short standalone headings with their body)
 * - inline numbered lists (1. / 2. / 3. / 4.)
 * - inline labeled points ("Benefit 1:", "Reason 2:", "Point 1:", "Advantage 1:", etc.)
 * Preserves conclusion headings ("Recommendation", "Conclusion:") attached to their body,
 * and strips inline point-number/label prefixes from body segments.
 */
export function splitResponsePoints(answer: string): string[] {
  const baseParagraphs = splitEssayParagraphs(answer);
  const inlineSplitRegex =
    /(?:^|(?<=[.!?;]\s+|\n))(?=(?:\(\d{1,2}\)\s+|\d{1,2}[.)]\s+|(?:point|reason|benefit|advantage|disadvantage|drawback|limitation|factor|method|way|option)\s*\d{1,2}\s*[:.-]\s+))/gi;

  const segments: string[] = [];
  for (const block of baseParagraphs) {
    const subParts = block
      .split(inlineSplitRegex)
      .map((s) => s.trim())
      .filter(Boolean);

    const partsToProcess = subParts.length > 0 ? subParts : [block];
    for (const part of partsToProcess) {
      if (CONCLUSION_HEADING_START_REGEX.test(part)) {
        segments.push(part);
      } else {
        const cleaned = part.replace(POINT_LABEL_PREFIX_REGEX, "").trim();
        if (cleaned) {
          segments.push(cleaned);
        }
      }
    }
  }
  return segments;
}
