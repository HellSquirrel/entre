/** @type {import('next').NextConfig} */

const remarkFrontmatter = require('./lib/frontmatter')

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter],
    rehypePlugins: [],
    providerImportSource: '@mdx-js/react',
  },
})

const nextConfig = withMDX({
  reactStrictMode: true,
  pageExtensions: ['tsx'],
})

module.exports = nextConfig
