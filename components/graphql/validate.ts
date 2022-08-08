import { validate, buildSchema } from 'graphql'
import { gql } from '@apollo/client'
import schema from './schema.graphql'

export const validateQueries = () => {
  const validQuery = gql`
    {
      allTypes {
        id
        name
      }
    }
  `

  const invalidQuery = gql`
    {
      fieldThatDoesNotExist {
        id
        name
      }
    }
  `

  return [validQuery, invalidQuery].map(q => validate(buildSchema(schema), q))
}
