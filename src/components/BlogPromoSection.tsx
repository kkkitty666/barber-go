"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { blogPosts } from "@/config/blog";
import { siteConfig } from "@/config/site";
import GlassSurface from "./GlassSurface";
import { PhotoWallpaperBlend } from "./PhotoWallpaperBlend";
import "./BlogPromoSection.css";

export function BlogPromoSection() {
  const { blogPromo } = siteConfig;
  const featuredPosts = blogPosts.slice(0, 3);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const blendEdges = isDesktop ? (["left", "bottom"] as const) : (["bottom"] as const);

  return (
    <section className="blog-promo section-photo-blend-side noise-overlay" aria-labelledby="blog-promo-title">
      <div className="blog-promo-inner mx-auto max-w-7xl">
        <div className="blog-promo-grid">
          <div className="blog-promo-content">
            <p className="blog-promo-label">{blogPromo.label}</p>
            <h2 id="blog-promo-title" className="blog-promo-headline">
              {blogPromo.headline}
              <br />
              {blogPromo.headlineLine2}
            </h2>
            <p className="blog-promo-description">{blogPromo.description}</p>

            <ul className="blog-promo-posts">
              {featuredPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="blog-promo-post-link">
                    <span className="blog-promo-post-date">{post.date}</span>
                    <span className="blog-promo-post-title">{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link href="/blog" className="blog-promo-cta-link">
              <GlassSurface
                width="100%"
                height="100%"
                borderRadius={20}
                displace={0.35}
                distortionScale={-160}
                redOffset={0}
                greenOffset={8}
                blueOffset={16}
                brightness={42}
                opacity={0.88}
                mixBlendMode="screen"
                backgroundOpacity={0.12}
                saturation={1.25}
                blur={13}
                className="blog-promo-cta-glass"
              >
                <span className="blog-promo-cta-label">{blogPromo.cta}</span>
              </GlassSurface>
            </Link>
          </div>

          <div className="blog-promo-visual">
            <div className="blog-promo-visual-glow blog-promo-visual-glow--red" aria-hidden />
            <div className="blog-promo-visual-glow blog-promo-visual-glow--blue" aria-hidden />
            <PhotoWallpaperBlend edges={[...blendEdges]} className="blog-promo-blend">
              <Image
                src={blogPromo.image}
                alt={blogPromo.imageAlt}
                fill
                className="blog-promo-image object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </PhotoWallpaperBlend>
            <div className="blog-promo-visual-overlay" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
