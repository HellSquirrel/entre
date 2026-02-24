import { GetServerSideProps } from 'next'
import { Post } from '../../types/blog'

function generateRSSFeed(posts: Post[]) {
  const siteUrl = 'https://hellsquirrel.dev'
  const rssDate = new Date().toUTCString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>RSS белки</title>
    <description>Древние технологии, скучная философия и немного клиентской магии</description>
    <link>${siteUrl}</link>
    <language>ru</language>
    <lastBuildDate>${rssDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss/ru" rel="self" type="application/rss+xml"/>
    ${posts
      .map(({ slug, frontmatter }) => {
        const postUrl = `${siteUrl}/blog/${slug}`
        const pubDate = new Date(frontmatter.date).toUTCString()

        return `
    <item>
      <title><![CDATA[${frontmatter.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      ${frontmatter.tags ? frontmatter.tags.map(tag => `<category>${tag}</category>`).join('\n      ') : ''}
    </item>`
      })
      .join('')}
  </channel>
</rss>`
}

function RSSFeedRu() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const rssFeed = generateRSSFeed(
    // @ts-ignore
    __POSTS__
      .filter((p: Post) => p.frontmatter.published)
      .filter((p: Post) => !p.frontmatter.locales || p.frontmatter.locales.includes('ru'))
  )

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  res.write(rssFeed)
  res.end()

  return {
    props: {},
  }
}

export default RSSFeedRu
