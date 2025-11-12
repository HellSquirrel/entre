import { GetServerSideProps } from 'next'
import { Post } from '../types/blog'

function generateRSSFeed(posts: Post[]) {
  const siteUrl = 'https://hellsquirrel.dev' // Replace with your actual domain
  const rssDate = new Date().toUTCString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Squirrels RSS</title>
    <description>Ancient techs, boring philosophy and a little bit of client side magic</description>
    <link>${siteUrl}</link>
    <language>en</language>
    <lastBuildDate>${rssDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(({ slug, frontmatter }) => {
        const postUrl = `${siteUrl}/blog/${slug}`
        const pubDate = new Date(frontmatter.date).toUTCString()

        const itemLang = frontmatter?.locales?.[0] || 'en';

        return `
    <item${itemLang !== 'en' ? ` xml:lang="${itemLang}"` : ''}>
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

function RSSFeed() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const rssFeed = generateRSSFeed(
    // @ts-ignore
    __POSTS__.filter(p => p.frontmatter.published)
  )

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  res.write(rssFeed)
  res.end()

  return {
    props: {},
  }
}

export default RSSFeed
