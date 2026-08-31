import { notFound } from "next/navigation";
import Link from "next/link";
import { getPageBySlug } from "@/cms/client";
import { PageRenderer } from "@/cms/page-renderer";

export const dynamic = "force-dynamic";

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = await getPageBySlug((await params).slug);
  if (!page) notFound();

  return (
    <div className="site-shell">
      <header className="site-header"><Link href="/"><strong>OpenCMS</strong></Link><span>{page.slug}</span></header>
      <PageRenderer page={page} />
    </div>
  );
}
