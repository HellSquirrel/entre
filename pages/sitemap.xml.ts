import { GetServerSideProps } from 'next'
import { Post } from '../types/blog'

function generateSiteMap(posts: Post[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://jsonplaceholder.typicode.com</loc>
     </url>
     <url>
       <loc>https://jsonplaceholder.typicode.com/guide</loc>
     </url>
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
  // We generate the XML sitemap with the posts data
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
