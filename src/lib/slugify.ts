export function slugifyForUrl(title: string): string {
  const ascii = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  if (ascii.length >= 4) return ascii.slice(0, 96);

  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
  return `article-${random}`;
}
