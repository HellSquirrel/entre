import {
  ApolloClient,
  InMemoryCache,
  gql,
  DocumentNode,
  Observable,
  ApolloLink,
  FetchResult,
  Operation,
} from '@apollo/client'
import { buildSchema, execute } from 'graphql'
import validQuery from './validQuery.graphql'
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

class MockLink extends ApolloLink {
  request(operation: Operation): Observable<FetchResult> {
    return new Observable(observer => {
      executeQuery(operation.query).then(result => {
        observer.next(result)
        observer.complete()
      })
    })
  }
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new MockLink(),
})

export const executeQueryWithApollo = async () => {
  const result = await client.query({
    query: gql(validQuery),
  })
  return result
}
