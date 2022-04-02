/** @type {import('next').NextConfig} */

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const matter = require('gray-matter')
const { redirect } = require('next/dist/server/api-utils')

const getPosts = fromPath => {
  const paths = glob.sync(`${path.join(fromPath)}/**/*.mdx`)

  return paths.map(filePath => {
    const source = fs.readFileSync(path.join(filePath), 'utf8')
    const { data } = matter(source)

    return {
      frontmatter: data,
    }
  })
}

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx'],

  webpack(config, options) {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: require.resolve('@mdx-js/loader'),
          options: {
            remarkPlugins: [],
            rehypePlugins: [],
            providerImportSource: '@mdx-js/react',
          },
        },
        {
          loader: require.resolve('./lib/frontmatterLoader.js'),
          options: {},
        },
      ],
    })
    config.plugins.push(
      new options.webpack.DefinePlugin({
        __POSTS__: JSON.stringify(getPosts(path.resolve(__dirname, './blog'))),
      })
    )

    return config
  },
  redirects: () => [
    {
      source: '/',
      destination: '/blog',
      permanent: true,
    },
  ],
}

module.exports = nextConfig
