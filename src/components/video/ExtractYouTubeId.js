export function extractYouTubeId(url) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if (hostname.includes("youtube.com")) {
      // ?v=...
      const id = parsedUrl.searchParams.get("v");
      if (id) return id;

      // /embed/, /v/, /shorts/, /live/
      const match = parsedUrl.pathname.match(/\/(embed|v|shorts|live)\/([^/?&]+)/);
      if (match) return match[2];
    }

    if (hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }
  } catch (e) {
    return null;
  }
  return null;
}