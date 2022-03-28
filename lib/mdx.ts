import fs from 'fs'
import path from 'path'
import glob from 'glob'
import matter from 'gray-matter'

// the front matter and content of all mdx files based on `docsPaths`
export const getAllFrontmatter = (fromPath: string) => {
  const paths = glob.sync(`${path.join(fromPath)}/**/*.mdx`)
  console.log(fromPath)

  return paths.map((filePath: string) => {
    const source = fs.readFileSync(path.join(filePath), 'utf8')
    const { data } = matter(source)

    return {
      ...data,
      slug: path.basename(filePath).replace('.mdx', ''),
    }
  })
}
