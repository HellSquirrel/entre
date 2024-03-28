type Tag = 'performance' | 'images'

export type Frontmatter = {
  title: string
  date: string
  tags: Tag[]
  slug: string
  published?: boolean
  description?: string
  image?: string
  external?: boolean
  locales?: ('en' | 'ru')[]
}

export type Post = { content: string; frontmatter: Frontmatter; slug: string }
