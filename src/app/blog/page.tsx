import type { Metadata } from "next";
import { BlogPageContent } from "@/components/BlogPageContent";
import { SiteShell } from "@/components/SiteShell";
import { pageSeo } from "@/config/site";

export const metadata: Metadata = {
  title: pageSeo.blog.title,
  description: pageSeo.blog.description,
};

export default function BlogPage() {
  return (
    <SiteShell>
      <BlogPageContent />
    </SiteShell>
  );
}
