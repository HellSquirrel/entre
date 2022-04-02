const refractor = require('refractor')
const visit = require('unist-util-visit')
const nodeToString = require('hast-util-to-string')

const mod = () => {
  return tree => {
    visit(tree, 'element', visitor)
  }

  function visitor(node, _, parent) {
    if (
      !parent ||
      parent.tagName !== 'pre' ||
      node.tagName !== 'code' ||
      !node.properties.className
    ) {
      return
    }
    const [, lang] = node.properties.className[0].split('-')
    const codeString = nodeToString(node)
    let result = refractor.highlight(codeString, lang)
    node.children = result
  }
}

module.exports = mod
