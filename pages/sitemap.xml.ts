import { GetServerSideProps } from 'next'
import { Post } from '../types/blog'

function generateSiteMap(posts: Post[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${posts
       .map(({ slug }) => {
         return `
       <url>
           <loc>/blog/${slug}</loc>
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
    __POSTS__.filter(p => !skipUnpublished || p.frontmatter.published)
  )

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
