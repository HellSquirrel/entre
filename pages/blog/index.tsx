import { promises } from 'fs'
import { NextPage } from 'next'

export const meta = [
  {
    title: 'Очевидности оптимизации картинок. Часть 1',
    date: '2022-03-27T20:57:25.682Z',
    tags: ['images', 'performance'],
  },
]

const ListOfAllPosts: NextPage = () => {
  return (
    <ul>
      {meta.map(({ title, date, tags }) => (
        <li key={title}>
          <h2>{title}</h2>
          <div>{new Date(date).toLocaleDateString()}</div>
          <ul>
            {tags.map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

export default ListOfAllPosts
