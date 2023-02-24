import Link from 'next/link'
import { LocaleProvider } from 'components/LocaleProvider'

const MeRu = () => {
  return (
    <div>
      <h1>Немного об авторе</h1>
      <p>
        Всем приветик 👋 Меня зовут Полина, я изобретаю всякое фронтяшное,
        редачу <Link href="https://doka.guide/">Доку</Link> и участвую во всяких
        GDE активностях. Там внизу есть ссылочки на мои соцсети и github 👇
      </p>

      <p>
        Я хочу шарить свои знания, поэтому у меня есть куча докладов, статей и
        подкастов. Наверное, я когда-нибудь перестану лениться и добавлю сюда
        большой список. Пока вот ссылочка на мой{' '}
        <Link href="https://speakerdeck.com/hellsquirrel">Speaker Deck</Link>
      </p>
    </div>
  )
}

const MeEn = () => {
  return (
    <div>
      <h1>Here's a little bit about the author.</h1>
      <p>
        Hey all 👋 I'm Polina, and I create all kinds of frontend magic. I'm
        also a contributor to Doka (https://doka.guide/) and take part in
        various GDE activities. Check out my social media and GitHub links at
        the bottom 👇
      </p>

      <p>
        I want to share my knowledge, so I have a lot of presentations,
        articles, and podcasts. Maybe someday I'll stop being lazy and add a big
        list here. For now, here's a link to my
        <Link href="https://speakerdeck.com/hellsquirrel">Speaker Deck</Link>
      </p>
    </div>
  )
}

export default () => (
  <LocaleProvider>
    <MeEn />
    <MeRu />
  </LocaleProvider>
)
