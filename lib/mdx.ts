import fs from 'fs'
import path from 'path'
import glob from 'glob'
import matter from 'gray-matter'
import { Post } from 'types/blog'

// the front matter and content of all mdx files based on `docsPaths`
export const getPosts = (fromPath: string): Post[] => {
  const paths = glob.sync(`${path.join(fromPath)}/**/*.mdx`)
  console.log(fromPath)

  return paths.map((filePath: string) => {
    const source = fs.readFileSync(path.join(filePath), 'utf8')
    const { data, content } = matter(source)

    return {
      frontmatter: data,
      content,
      slug: path.basename(filePath).replace('.mdx', ''),
    } as Post
  })
}
