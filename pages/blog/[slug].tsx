import fs from 'fs'
import path from 'path'

export const getStaticPaths = async () => {
  const files = fs.readdirSync(path.join('posts'))
  const paths = files.map(filename => ({
    params: {
      slug: filename.replace('.mdx', ''),
    },
  }))
  return {
    paths,
    fallback: false,
  }
}
