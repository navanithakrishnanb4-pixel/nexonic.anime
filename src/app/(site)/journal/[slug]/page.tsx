import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJournalPostBySlug, getRelatedJournalPosts } from "@/lib/journal-data";
import { JournalArticleHeader } from "@/components/journal/JournalArticleHeader";
import { JournalArticleBody } from "@/components/journal/JournalArticleBody";
import { RelatedJournalPosts } from "@/components/journal/RelatedJournalPosts";

interface JournalArticlePageProps {
  params: { slug: string };
}

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
    <article className="py-xl flex flex-col gap-xl">
      <JournalArticleHeader post={post} />
      <JournalArticleBody content={post.content} />
      <RelatedJournalPosts posts={related} />
    </article>
  );
}
