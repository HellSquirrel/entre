import React, { useState } from 'react'
import { styled } from '@styles'

const Container = styled('div', {
  border: '1px solid $slate6',
  borderRadius: '8px',
  padding: '$3',
  margin: '$3 0',
  fontFamily: '$code',
  fontSize: '$secondary',
})

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '$2',
  '@bp1': {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
})

const FieldWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

const Label = styled('label', {
  fontSize: '$small',
  color: '$slate11',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

const VarName = styled('span', {
  fontWeight: 'bold',
  color: '$slate12',
})

const Input = styled('input', {
  fontFamily: '$code',
  fontSize: '$secondary',
  padding: '6px 8px',
  borderRadius: '4px',
  border: '1px solid $slate6',
  background: '$slate2',
  color: '$slate12',
  width: '100%',
  boxSizing: 'border-box',
  '&:focus': {
    outline: 'none',
    borderColor: '$indigo8',
  },
  variants: {
    suggested: {
      true: {
        borderColor: '$green8',
        background: '$green2',
        color: '$green11',
      },
    },
  },
})

const ResultsRow = styled('div', {
  display: 'flex',
  gap: '$2',
  marginTop: '$2',
  flexWrap: 'wrap',
})

const Result = styled('div', {
  flex: 1,
  minWidth: '160px',
  background: '$slate3',
  borderRadius: '4px',
  padding: '$2',
})

const ResultLabel = styled('div', {
  fontSize: '$small',
  color: '$slate11',
  marginBottom: '4px',
})

const ResultValue = styled('div', {
  fontFamily: '$code',
  fontSize: '$main',
  fontWeight: 'bold',
  variants: {
    equal: {
      true: { color: '$green11' },
      false: { color: '$slate12' },
    },
    invalid: {
      true: { color: '$red11' },
    },
  },
})

const SuggestionNote = styled('div', {
  marginTop: '$2',
  fontSize: '$small',
  color: '$green11',
  background: '$green2',
  border: '1px solid $green6',
  borderRadius: '4px',
  padding: '8px $2',
})

type Fields = { x: string; c: string; a: string; v: string; s: string; p: string }

const descriptions: Record<keyof Fields, string> = {
  s: 'non-delegatable fraction',
  a: 'time to write prompt, minutes',
  v: 'time to verify result, minutes',
  p: 'number of agents',
  x: 'agent work time, minutes',
  c: 'context switch time, minutes',
}

const constraints: Record<keyof Fields, { min?: number; max?: number; step?: number }> = {
  s: { min: 0, max: 1 },
  a: { min: 0 },
  v: { min: 0 },
  c: { min: 0 },
  x: { min: 0 },
  p: { min: 1, step: 1 },
}

const fmt = (n: number, round = false) => {
  if (!isFinite(n) || isNaN(n)) return '—'
  return round ? String(Math.round(n)) : parseFloat(n.toFixed(4)).toString()
}

const parse = (v: string) => (v.trim() === '' ? null : parseFloat(v))

// Solve for the blank variable to make (1-s)/(a+v+c) = p/x
function suggest(fields: Fields): { key: keyof Fields; value: number } | null {
  const blanks = (Object.keys(fields) as (keyof Fields)[]).filter(k => fields[k].trim() === '')
  if (blanks.length !== 1) return null

  const blank = blanks[0]
  const n = (k: keyof Fields) => parse(fields[k]) ?? NaN

  const s = n('s'), a = n('a'), v = n('v'), p = n('p'), x = n('x'), c = n('c')

  let value: number
  switch (blank) {
    case 's':
      // (1-s)/(a+v+c) = p/x  =>  s = 1 - p*(a+v+c)/x
      value = 1 - (p * (a + v + c)) / x
      break
    case 'a':
      // a+v+c = (1-s)*x/p  =>  a = (1-s)*x/p - v - c
      value = ((1 - s) * x) / p - v - c
      break
    case 'v':
      // v = (1-s)*x/p - a - c
      value = ((1 - s) * x) / p - a - c
      break
    case 'c':
      // c = (1-s)*x/p - a - v
      value = ((1 - s) * x) / p - a - v
      break
    case 'p':
      // p/x = (1-s)/(a+v+c)  =>  p = (1-s)*x/(a+v+c)
      value = ((1 - s) * x) / (a + v + c)
      break
    case 'x':
      // x = p*(a+v+c)/(1-s)
      value = (p * (a + v + c)) / (1 - s)
      break
    default:
      return null
  }

  if (!isFinite(value) || isNaN(value)) return null
  return { key: blank, value }
}

export const ThroughputCalculator = () => {
  const [fields, setFields] = useState<Fields>({ x: '', c: '', a: '', v: '', s: '', p: '' })

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields(f => ({ ...f, [k]: e.target.value }))

  const get = (k: keyof Fields) => {
    const s = suggest(fields)
    if (s?.key === k) return s.value
    return parse(fields[k])
  }

  const s = get('s'), a = get('a'), v = get('v'), p = get('p'), x = get('x'), c = get('c')

  const t1 = s !== null && a !== null && v !== null && c !== null ? (1 - s) / (a + v + c) : null
  const t2 = p !== null && x !== null ? p / x : null
  const equal = t1 !== null && t2 !== null && Math.abs(t1 - t2) < 1e-9

  const hint = suggest(fields)
  const fieldOrder: (keyof Fields)[] = ['s', 'a', 'v', 'p', 'x', 'c']

  return (
    <Container>
      <Grid>
        {fieldOrder.map(k => {
          const isSuggested = hint?.key === k
          return (
            <FieldWrapper key={k}>
              <Label>
                <VarName>{k}</VarName>
                <span>{descriptions[k]}</span>
              </Label>
              <Input
                type="number"
                value={fields[k]}
                onChange={set(k)}
                placeholder={isSuggested ? fmt(hint.value, k === 'p') : ''}
                suggested={isSuggested}
                {...constraints[k]}
              />
            </FieldWrapper>
          )
        })}
      </Grid>

      <ResultsRow>
        <Result>
          <ResultLabel>(1 - s) / (a + v + c)</ResultLabel>
          <ResultValue equal={equal}>{t1 !== null ? fmt(t1) : '—'}</ResultValue>
        </Result>
        <Result>
          <ResultLabel>p / x</ResultLabel>
          <ResultValue equal={equal}>{t2 !== null ? fmt(t2) : '—'}</ResultValue>
        </Result>
      </ResultsRow>

      {hint && (
        <SuggestionNote>
          Set <strong>{hint.key}</strong> = <strong>{fmt(hint.value, hint.key === 'p')}</strong> to balance both outputs.
        </SuggestionNote>
      )}
    </Container>
  )
}
