import React from 'react'
import { styled } from '@styles'

type Cell = string | number

type Props = {
  caption: string
  head: string[]
  rows: Cell[][]
}

// Borders follow the text colour, so the table reads in both themes
// without a palette of its own.
const Scroll = styled('div', {
  overflowX: 'auto',
  margin: '$3 0',
})

const Table = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '$secondary',
  fontVariantNumeric: 'tabular-nums',

  caption: {
    captionSide: 'bottom',
    textAlign: 'left',
    fontSize: '$small',
    opacity: 0.7,
    paddingTop: '$2',
  },
  'th, td': {
    padding: '6px $2',
    textAlign: 'right',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid color-mix(in srgb, currentColor 18%, transparent)',
  },
  'th:first-child': { textAlign: 'left', fontWeight: 'normal' },
  'thead th': {
    fontWeight: 600,
    borderBottom: '2px solid color-mix(in srgb, currentColor 45%, transparent)',
  },
  'tbody tr:last-child th, tbody tr:last-child td': { borderBottom: 'none' },
})

export const DataTable = ({ caption, head, rows }: Props) => (
  <Scroll>
    <Table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {head.map((h, i) => (
            <th key={i} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, r) => (
          <tr key={r}>
            {row.map((cell, c) =>
              c === 0 ? (
                <th key={c} scope="row">
                  {cell}
                </th>
              ) : (
                <td key={c}>{cell}</td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  </Scroll>
)
