import { gql } from '@apollo/client'
import invalidQuery from './incorrectQuery.graphql'

export const parseIncorrect = (): string => {
  let message = ''
  try {
    const query = gql(invalidQuery)
  } catch (e) {
    message = (e as Error).message
  }

  return message
}
