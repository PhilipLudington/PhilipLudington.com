import { getCollection } from 'astro:content'

/**
 * Published blog posts (drafts excluded), newest first.
 * Single source of truth for "what counts as published" — both the index
 * and the post route must use this so draft posts are neither listed nor built.
 */
export async function getPublishedPosts() {
  const posts = await getCollection('blog')
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

/**
 * Format a post date for display. Uses UTC because frontmatter dates
 * (e.g. `date: 2026-07-21`) resolve to UTC midnight — formatting in the
 * build machine's local timezone can render the wrong calendar day.
 */
export function formatPostDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
