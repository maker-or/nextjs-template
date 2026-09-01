import { opencms } from "./opencms";

export interface ContentBlock {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  status: "draft" | "published";
  content: {
    version: 1;
    blocks: ContentBlock[];
  };
}

export class OpenCmsClientError extends Error {}

export async function getPages(): Promise<Page[]> {
  if (!opencms.projectId) {
    throw new OpenCmsClientError("NEXT_PUBLIC_OPENCMS_PROJECT_ID is not configured.");
  }
  if (!opencms.apiUrl) {
    throw new OpenCmsClientError("OPENCMS_API_URL is not configured.");
  }

  const url = new URL(`/api/delivery/projects/${opencms.projectId}/pages`, opencms.apiUrl);
  url.searchParams.set("environment", opencms.environment);

  const response = await fetch(url, {
    ...(opencms.environment === "production"
      ? { next: { revalidate: 30 } }
      : { cache: "no-store" as const }),
  });

  if (!response.ok) {
    let message = response.statusText || "Unable to load OpenCMS pages.";
    try {
      const body = (await response.json()) as { error?: string };
      message = body.error ?? message;
    } catch {
      // Keep the status text when the API response is not JSON.
    }
    throw new OpenCmsClientError(message);
  }

  return (await response.json()) as Page[];
}

export async function getPageBySlug(slug: string) {
  const pages = await getPages();
  return pages.find((page) => page.slug === slug) ?? null;
}
