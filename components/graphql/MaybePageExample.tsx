import { FC } from 'react'
import { useQuery, gql } from '@apollo/client'

const PageQuery = gql`
  query GetType {
    algebraicDataType(id: 1) {
      name
      id
      description
    }
  }
`

export const MaybePage: FC = () => {
  const { data, loading } = useQuery(PageQuery)
  return (
    <>
      {loading || data === undefined ? (
        'Loading...'
      ) : (
        <>
          <h3>{data.algebraicDataType.name}</h3>
          <p> {data.algebraicDataType.description} </p>

          {/* Ooops! */}
          <p> {data.algebraicDataType.parametersCount} </p>
        </>
      )}
    </>
  )
}
