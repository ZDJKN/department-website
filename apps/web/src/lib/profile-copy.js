export function profileParagraphs(value) {
  const text = String(value || "")
    .replace(/\r\n?/g, "\n")
    .trim();
  if (!text) return [];
  return text
    .replace(/(^|[^\d])(\d{1,2}、)/g, "$1\n\n$2")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
