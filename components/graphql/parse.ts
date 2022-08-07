import { gql } from '@apollo/client'

export const query = gql`
  query GetAllPages {
    allPages {
      id
      text
    }
  }
`

console.log(query)
