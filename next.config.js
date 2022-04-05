/** @type {import('next').NextConfig} */

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const matter = require('gray-matter')
const highlight = require('./lib/highlighter.js')

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
    config.module.rules = config.module.rules.concat([
      {
        test: /\.mdx?$/,
        use: [
          options.defaultLoaders.babel,
          {
            loader: require.resolve('@mdx-js/loader'),
            options: {
              remarkPlugins: [],
              rehypePlugins: [highlight],
              providerImportSource: '@mdx-js/react',
            },
          },
          {
            loader: require.resolve('./lib/frontmatterLoader.js'),
            options: {},
          },
        ],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
    ])
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
