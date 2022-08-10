import schema from './schema.graphql'
import schemaV1 from './schemaV1.graphql'

import { parse, DocumentNode, ObjectTypeDefinitionNode } from 'graphql'

const oldSchema = parse(schema)
const newSchema = parse(schemaV1)

const collectFields = (schema: DocumentNode) =>
  schema.definitions
    .filter(({ kind }) => kind === 'ObjectTypeDefinition')
    .flatMap(def => (def as ObjectTypeDefinitionNode).fields)
    .map(field => field?.name.value)
    .reduce<Record<string, number>>((acc, fieldName) => {
      if (!fieldName) return acc
      const prevCount = acc[fieldName] || 0
      return { ...acc, [fieldName]: prevCount + 1 }
    }, {})

export const getRemovedFields = () => {
  const oldFields = collectFields(oldSchema)
  const newFields = collectFields(newSchema)

  return Object.keys(oldFields).filter(
    fieldName => newFields[fieldName] - oldFields[fieldName] < 0
  )
}
