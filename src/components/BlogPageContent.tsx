"use client";

import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/config/blog";
import { assets, siteConfig } from "@/config/site";
import { CornerFlourish } from "./DecorativeElements";
import { PhotoWallpaperBlend } from "./PhotoWallpaperBlend";
import "./BlogPage.css";

const categoryLabels: Record<string, string> = {
  barbershop: "БАРБЕРШОП",
  haircuts: "МУЖСКИЕ СТРИЖКИ",
  style: "СТИЛЬ",
};

function ClockIcon() {
  return (
    <svg className="blog-card-clock" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function BlogPageContent() {
  const featuredPost = blogPosts.find((p) => p.featured) ?? blogPosts[0];
  const otherPosts = blogPosts.filter((p) => p.slug !== featuredPost.slug);

  return (
    <div className="blog-page">
      <section className="blog-hero section-photo-blend">
        <PhotoWallpaperBlend edges={["bottom"]} className="blog-hero-blend">
          <Image
            src={featuredPost.image}
            alt=""
            fill
            className="blog-hero-bg object-cover"
            priority
            sizes="100vw"
          />
        </PhotoWallpaperBlend>
        <div className="blog-hero-overlay" />

        <div className="blog-hero-frame-wrap">
          <div className="blog-hero-frame">
            <CornerFlourish position="top-left" className="left-0 top-0" />
            <CornerFlourish position="top-right" className="right-0 top-0" />
            <CornerFlourish position="bottom-left" className="bottom-0 left-0" />
            <CornerFlourish position="bottom-right" className="bottom-0 right-0" />

            <div className="blog-hero-frame-inner">
              <div>
                <h1 className="blog-hero-title">БЛОГ PC БАРБЕРШОП</h1>
                <p className="blog-hero-subtitle">{siteConfig.blogPage.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-content-section section-padding !pt-10 !pb-6">
        <div className="mx-auto max-w-7xl">
          <div className="services-banner blog-category-ribbon">
            {categoryLabels[featuredPost.category] ?? "БЛОГ"}
          </div>

          <div className="blog-featured-grid">
            <Link href={`/blog/${featuredPost.slug}`} className="blog-featured-card">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="blog-featured-overlay" />
              {featuredPost.popular && (
                <span className="blog-popular-badge">Популярная статья</span>
              )}
              <div className="blog-featured-content">
                <time className="blog-card-date">{featuredPost.date}</time>
                <h2 className="blog-featured-title">{featuredPost.title}</h2>
                <div className="blog-card-meta">
                  <span className="blog-card-read">
                    <ClockIcon />
                    {featuredPost.readTime}
                  </span>
                </div>
              </div>
            </Link>

            <aside className="blog-brand-card canvas-frame">
              <Image
                src={assets.logoGold}
                alt={siteConfig.name}
                width={120}
                height={120}
                className="blog-brand-logo"
              />
              <p className="blog-brand-name">{siteConfig.name}</p>
              <p className="blog-brand-tagline">{siteConfig.blogPage.brandTagline}</p>
              <p className="blog-brand-motto">{siteConfig.motto}</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="blog-grid-section section-padding !pt-0">
        <div className="mx-auto max-w-7xl">
          <div className="blog-posts-grid">
            {otherPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-post-card group">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="blog-post-overlay" />
                <div className="blog-post-content">
                  <div className="blog-post-meta-row">
                    <time className="blog-card-date">{post.date}</time>
                    <span className="blog-card-read">
                      <ClockIcon />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="blog-post-title">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
