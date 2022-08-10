import { MaybePage, MaybePageQuery } from './MaybePage'
import { screen, render } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

it('Renders Maybe page', async () => {
  const mocks = [
    {
      request: {
        query: MaybePageQuery,
      },
      result: {
        data: {
          algebraicDataType: {
            name: 'Maybe',
            id: 1,
            description: '',
          },
        },
      },
    },
  ]

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MaybePage />
    </MockedProvider>
  )

  expect(await screen.findByText('Loading...')).toBeInTheDocument()
  expect(await screen.findByText('Maybe')).toBeInTheDocument()
})
