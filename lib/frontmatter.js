// const matter = require('gray-matter')

module.exports = () => (tree, file) => {
  // const { data: frontMatter, content } = matter(file.value)

  // tree.children.push({
  //   type: 'export',
  //   value: `export const frontMatter = ${JSON.stringify(frontMatter)}`,
  // })

  if (tree.children[0].type === 'thematicBreak') {
    const firstHeadingIndex = tree.children.findIndex(t => t.type === 'heading')
    if (firstHeadingIndex !== -1) {
      // we will mutate the tree.children by removing these nodes
      tree.children.splice(0, firstHeadingIndex + 1)
    }
  }
}
