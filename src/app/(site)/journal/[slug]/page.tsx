import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJournalPostBySlug, getRelatedJournalPosts } from "@/lib/journal-data";
import { JournalArticleHero } from "@/components/journal/JournalArticleHero";
import { JournalArticleBody } from "@/components/journal/JournalArticleBody";
import { RelatedJournalPosts } from "@/components/journal/RelatedJournalPosts";

interface JournalArticlePageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: JournalArticlePageProps): Promise<Metadata> {
  const post = await getJournalPostBySlug(params.slug);
  if (!post) return { title: "Article Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default async function JournalArticlePage({ params }: JournalArticlePageProps) {
  const post = await getJournalPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const related = await getRelatedJournalPosts(post.slug);

  return (
    <article>
      <JournalArticleHero post={post} />
      <JournalArticleBody post={post} />
      <RelatedJournalPosts posts={related} />
    </article>
  );
}
