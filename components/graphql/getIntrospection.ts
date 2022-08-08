import {
  execute,
  buildSchema,
  getIntrospectionQuery,
  parse,
  ExecutionResult,
} from 'graphql'

import schema from './schema.graphql'

const schemaAst = buildSchema(schema)
const introspectionAst = parse(getIntrospectionQuery())

export const getIntrospectionResult = async () =>
  execute({
    schema: schemaAst,
    document: introspectionAst,
    rootValue: {},
  }) as Promise<ExecutionResult>
