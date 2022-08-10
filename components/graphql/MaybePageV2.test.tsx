import { MaybePage, MaybePageQuery } from './MaybePage'
import { screen, render } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { addMocksToSchema } from '@graphql-tools/mock'
import schema from './schema.graphql'
import { execute, buildSchema, DocumentNode } from 'graphql'

const getSchemaWithMocks = (customMocks = {}) =>
  addMocksToSchema({ schema: buildSchema(schema), mocks: customMocks })

const createMock = async (query: DocumentNode, customMocks = {}) => ({
  request: {
    query,
  },
  result: await execute({
    schema: getSchemaWithMocks(customMocks),
    document: MaybePageQuery,
  }),
})

it('Renders Maybe page', async () => {
  const mocks = [await createMock(MaybePageQuery)]

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MaybePage />
    </MockedProvider>
  )

  expect(await screen.findByText('Loading...')).toBeInTheDocument()
  expect(await screen.findAllByText('Hello World')).toHaveLength(2)
})
