import Link from "next/link";
import type { BlogPost } from "@/config/blog";
import { CornerFlourish } from "./DecorativeElements";
import "./BlogArticle.css";

interface BlogArticleProps {
  post: BlogPost;
}

export function BlogArticle({ post }: BlogArticleProps) {
  return (
    <article className="blog-article">
      <Link href="/blog" className="blog-article__back">
        ← Все статьи
      </Link>

      <header className="blog-article__header">
        <div className="blog-article__meta">
          <time>{post.date}</time>
          <span>{post.readTime}</span>
        </div>
        <h1 className="blog-article__title">{post.title}</h1>
        <p className="blog-article__excerpt">{post.excerpt}</p>
      </header>

      <div className="blog-article__hero canvas-frame">
        <CornerFlourish position="top-left" className="left-2 top-2 !h-8 !w-8" />
        <CornerFlourish position="top-right" className="right-2 top-2 !h-8 !w-8" />
        <CornerFlourish position="bottom-left" className="bottom-2 left-2 !h-8 !w-8" />
        <CornerFlourish position="bottom-right" className="right-2 bottom-2 !h-8 !w-8" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt="" className="blog-article__hero-image" />
      </div>

      <div className="blog-article__body">
        {post.sections.map((section) => (
          <section key={section.heading ?? section.paragraphs[0].slice(0, 40)} className="blog-article__section">
            {section.heading && <h2>{section.heading}</h2>}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
