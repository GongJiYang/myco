// Content extraction utilities

export interface ExtractedContent {
  title: string;
  content: string;
  url: string;
  author?: string;
  publishedDate?: string;
}

export async function extractArticleContent(
  url: string,
  html: string
): Promise<ExtractedContent> {
  // Simple content extraction
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Extract title
  const title =
    doc.querySelector("h1")?.textContent ||
    doc.title ||
    "Untitled Article";

  // Try to find main content
  const contentSelectors = [
    "article",
    "main",
    ".content",
    "#content",
    ".post-content",
    ".article-content",
  ];

  let content = "";
  for (const selector of contentSelectors) {
    const element = doc.querySelector(selector);
    if (element) {
      content = element.textContent || "";
      break;
    }
  }

  // Fallback to body content
  if (!content) {
    content = doc.body.textContent || "";
  }

  // Extract metadata
  const author =
    doc.querySelector('[rel="author"]')?.textContent ||
    doc.querySelector(".author")?.textContent ||
    undefined;

  const publishedDate =
    doc.querySelector("time")?.getAttribute("datetime") ||
    doc.querySelector('[rel="published"]')?.getAttribute("content") ||
    undefined;

  return {
    title,
    content: content.trim(),
    url,
    author,
    publishedDate,
  };
}

export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
}

export function extractKeyPoints(text: string, maxLength: number = 500): string {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  if (sentences.length === 0) return text;

  const sentencesWithWeights = sentences.map((sentence) => ({
    sentence: sentence.trim(),
    weight:
      sentence.split(" ").length * 0.1 +
      (sentence.includes("important") ? 1 : 0) +
      (sentence.includes("key") ? 1 : 0),
  }));

  sentencesWithWeights.sort((a, b) => b.weight - a.weight);

  let result = "";
  let currentLength = 0;

  for (const { sentence } of sentencesWithWeights) {
    if (currentLength + sentence.length > maxLength) break;
    result += sentence + ". ";
    currentLength += sentence.length;
  }

  return result.trim();
}
