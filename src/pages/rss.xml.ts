import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context: { site?: URL }) {
  const posts = (await getCollection('blog'))
    .sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date))

  return rss({
    title: 'Glossarist Blog',
    description: 'Release notes, technical breakdowns, and insights from the Glossarist community — covering the concept model, the software ecosystem, and real-world terminology management.',
    site: context.site ?? 'https://www.glossarist.org',
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description ?? '',
      link: `/blog/${post.id}/`,
    })),
  })
}
