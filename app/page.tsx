import Link from "next/link";
import { getPages, OpenCmsClientError, type Page } from "@/cms/client";
import { PageRenderer } from "@/cms/page-renderer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const result = await loadHomePage();

  if (result.error) {
    return <ConnectionState message={result.error} />;
  }

  if (!result.page) {
    return <ConnectionState message="Create a page in the OpenCMS dashboard to start building this site." />;
  }

  return <SitePage page={result.page} />;
}

async function loadHomePage(): Promise<{ page: Page | null; error: string | null }> {
  try {
    const pages = await getPages();
    return { page: pages.find((item) => item.slug === "home") ?? pages[0] ?? null, error: null };
  } catch (error) {
    return { page: null, error: error instanceof OpenCmsClientError ? error.message : "Unable to connect to OpenCMS." };
  }
}

function SitePage({ page }: { page: Page }) {
  return (
    <div className="site-shell">
      <header className="site-header"><Link href="/"><strong>OpenCMS</strong></Link><span>{page.slug}</span></header>
      <PageRenderer page={page} />
    </div>
  );
}

function ConnectionState({ message }: { message: string }) {
  return (
    <main className="empty-state">
      <p className="eyebrow">OpenCMS starter</p>
      <h1>Your content will appear here.</h1>
      <p>{message}</p>
    </main>
  );
}
