type Tag = 'performance' | 'images'

export type Frontmatter = {
  title: string
  date: string
  tags: Tag[]
  slug: string
}

export type Post = { content: string; frontmatter: Frontmatter; slug: string }
