import { buildSchema, execute, parse } from 'graphql'
import schema from './schema.graphql'
import validQuery from './validQuery.graphql'

const schemaAst = buildSchema(schema)
const document = parse(validQuery)

const rootResolver = {
  allPages: [],
}

console.log(schemaAst)

export const executeQuery = async () => {
  const result = await execute({
    schema: schemaAst,
    document,
    rootValue: rootResolver,
  })

  return result
}
