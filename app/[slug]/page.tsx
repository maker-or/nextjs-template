import { notFound } from "next/navigation";
import Link from "next/link";
import { getPageBySlug, OpenCmsClientError } from "@/cms/client";
import { PageRenderer } from "@/cms/page-renderer";

export const dynamic = "force-dynamic";

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  let page;
  try {
    page = await getPageBySlug((await params).slug);
  } catch (error) {
    return <ConnectionState message={error instanceof OpenCmsClientError ? error.message : "Unable to connect to OpenCMS."} />;
  }
  if (!page) notFound();

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
