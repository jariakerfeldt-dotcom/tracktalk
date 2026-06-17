export default async (req) => {
  const url = new URL(req.url).searchParams.get("url");
  if (!url) {
    return new Response(JSON.stringify({ error: "No url" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; TrackTalkBot/1.0; +https://tracktalk.se)" },
      redirect: "follow",
    });
    const html = await res.text();

    const getMeta = (prop) => {
      const re1 = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i");
      const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, "i");
      const re3 = new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i");
      const re4 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${prop}["']`, "i");
      const m = html.match(re1) || html.match(re2) || html.match(re3) || html.match(re4);
      return m ? m[1] : null;
    };

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

    const data = {
      url,
      title: getMeta("og:title") || (titleMatch ? titleMatch[1] : null) || url,
      description: getMeta("og:description") || getMeta("description") || "",
      image: getMeta("og:image") || null,
      siteName: getMeta("og:site_name") || new URL(url).hostname.replace("www.", ""),
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch", url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = { path: "/api/link-preview" };
