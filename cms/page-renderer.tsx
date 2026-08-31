import type { ContentBlock, Page } from "./client";

function renderBlock(block: ContentBlock) {
  if (block.type === "heading") {
    const text = typeof block.data.text === "string" ? block.data.text : "";
    const level = block.data.level === 1 ? 1 : 2;
    return level === 1 ? <h1 key={block.id}>{text}</h1> : <h2 key={block.id}>{text}</h2>;
  }

  if (block.type === "quote") {
    const text = typeof block.data.text === "string" ? block.data.text : "";
    const author = typeof block.data.author === "string" ? block.data.author : "";
    return (
      <figure key={block.id} className="quote">
        <blockquote>{text}</blockquote>
        {author && <figcaption>{author}</figcaption>}
      </figure>
    );
  }

  if (block.type === "feature-list") {
    const title = typeof block.data.title === "string" ? block.data.title : "";
    const items = typeof block.data.items === "string"
      ? block.data.items.split("\n").map((item) => item.trim()).filter(Boolean)
      : [];
    return (
      <section key={block.id} className="feature-list">
        {title && <h2>{title}</h2>}
        <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
    );
  }

  const text = typeof block.data.text === "string" ? block.data.text : "";
  return <p key={block.id}>{text}</p>;
}

export function PageRenderer({ page }: { page: Page }) {
  return (
    <article className="page">
      <p className="eyebrow">OpenCMS page</p>
      <h1 className="page-title">{page.title}</h1>
      <div className="page-body">{page.content.blocks.map(renderBlock)}</div>
    </article>
  );
}
