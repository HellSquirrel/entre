// TODO decide if I want to move in this direction
const fs = require('fs')
const path = require('path')
const { globSync } = require('glob')
const matter = require('gray-matter')

const getPosts = fromPath => {
  const paths = globSync(`${path.join(fromPath)}/**/*.mdx`)

  return paths.map(filePath => {
    const source = fs.readFileSync(path.join(filePath), 'utf8')
    const { data } = matter(source)

    return {
      frontmatter: data,
    }
  })
}

class FrontmatterPlugin {
  apply(compiler) {
    const pluginName = 'FrontmatterPlugin'
    const { webpack } = compiler
    const { Compilation } = webpack
    const { RawSource } = webpack.sources
    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      const posts = getPosts('./blog')
      // Tapping to the assets processing pipeline on a specific stage.
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },

        assets => {
          const content = JSON.stringify(posts)
          compilation.emitAsset('frontmatter.json', new RawSource(content))
        }
      )
    })
  }
}

module.exports = FrontmatterPlugin
