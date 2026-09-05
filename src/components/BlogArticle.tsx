import Image from "next/image";
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
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className={`blog-article__hero-image${post.imageFit === "contain" ? " blog-article__hero-image--product" : ""}`}
        />
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

        <aside className="blog-article__shop">
          <p className="blog-article__shop-eyebrow">WHITE COSMETICS · ВЫБОР ИЗ СТАТЬИ</p>
          <h2>Подберите уход для дома</h2>
          <p>
            Перейдите к рекомендованному средству, чтобы посмотреть описание,
            способ применения, цену и наличие.
          </p>
          <Link href={post.shopHref} className="blog-article__shop-link">
            {post.shopLabel}
            <span aria-hidden>→</span>
          </Link>
        </aside>
      </div>
    </article>
  );
}
