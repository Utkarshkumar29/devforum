import { cacheLife } from "next/cache";

interface FeedResponse {
  page_number: number;
  results: Array<{ slug: string; id: string }>;
  count: number;
  per_page: number;
  total_pages: number;
  current_page_number: number;
  links: { next: string | null; previous: string | null };
}

export async function getCachedFeedPage(
  page: number,
  limit: number,
  authorization: string,
): Promise<FeedResponse> {
  "use cache";

  // Feed pages change often, so refresh in the background about once a minute.
  cacheLife("minutes");

  const backendUrl = (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://devforum-gateway.onrender.com"
  ).replace(/\/$/, "");

  const url = new URL(`${backendUrl}/api/posts/getPosts`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url, {
    headers: { Authorization: authorization },
  });

  if (!response.ok) {
    const error = new Error(
      `Feed request failed (${response.status})`,
    ) as Error & {
      status?: number;
    };
    error.status = response.status;
    throw error;
  }

  return response.json() as Promise<FeedResponse>;
}
