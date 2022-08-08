import React from 'react'
import GraphiQL from 'graphiql'
import 'graphiql/graphiql.css'

import { buildSchema, execute, DocumentNode, parse } from 'graphql'
import schema from './schema.graphql'
import { addMocksToSchema } from '@graphql-tools/mock'

const schemaAst = buildSchema(schema)

const schemaWithMocks = addMocksToSchema({
  schema: schemaAst,
  mocks: {
    AlgebraicDataType: () => ({
      name: 'Maybe',
      description: 'Either or Nothing!',
      parametersCount: 1,
    }),
  },
})

const executeQuery = async (document: DocumentNode) => {
  const result = await execute({
    schema: schemaWithMocks,
    document,
  })
  return result
}

export const DocView = () => (
  <div style={{ height: 600, width: 800 }}>
    <GraphiQL fetcher={({ query }) => executeQuery(parse(query))} />
  </div>
)
