const matter = require('gray-matter')

const frontmatterLoader = source => {
  const { data, content } = matter(source)
  const contentString = `${content}
export const frontmatter = ${JSON.stringify(data)}`
  return contentString
}

module.exports = frontmatterLoader
