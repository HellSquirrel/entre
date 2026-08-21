import { GetServerSideProps } from 'next'
import { Post } from '../types/blog'

const siteUrl = 'https://hellsquirrel.dev'
const skipUnpublished = process.env.NODE_ENV === 'production'

function generateSiteMap(posts: Post[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${posts
       .map(({ slug }) => {
         return `
       <url>
           <loc>${siteUrl}/blog/${slug}</loc>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSiteMap(
    // @ts-ignore
    __POSTS__
      .filter((p: Post) => !skipUnpublished || p.frontmatter.published)
      // sitemap URLs must be on this host - external cross-posts don't belong here
      .filter((p: Post) => !p.frontmatter.external)
  )

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
