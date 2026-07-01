import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/BlogArticle";
import { SiteShell } from "@/components/SiteShell";
import { getAllBlogSlugs, getBlogPost } from "@/config/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} — PC Барбершоп`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <SiteShell>
      <div className="section-padding">
        <BlogArticle post={post} />
      </div>
    </SiteShell>
  );
}
