import { useAuthState } from 'react-firebase-hooks/auth'
import firebase, { authProviders } from 'lib/client/firebase'
import { loginWith } from 'lib/client/helpers'
import { useRequireNoUser } from 'lib/client/hooks'

import { FC } from 'react'
import Container from 'components/container'
import Button from 'components/button'
import { useRouter } from 'next/router'
import { FullscreenLoader } from 'components/loader'

const Index: FC = () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireNoUser(user, loading, '/dashboard')

  const router = useRouter()

  const login = async () => {
    await loginWith(authProviders.google)()
    router.push('/dashboard')
  }
  if(loading) return <FullscreenLoader />
  return <>
    <h1 className="name">educal</h1>
    <div className="container">
    <section className="main">   
      <h1 className="title">Motivating students, one point at a time</h1>
      <p className="description">
      Educal allows you to create and join classrooms. From here, teachers can add points and students within those classes can eventually redeem those points for gift cards 
      </p>
      <div className="button-group">
        <Button onClick={login} bg="accent" fg="background" fontWeight={700} fontSize="lg" p={{x: 32, y: 12}}>Try it out!</Button>
      </div>
    </section>
    </div>
    <style jsx>{`
      h1.name {
        top: 12px;
        left: 24px;
        position: absolute;
        margin:0;
      }
      h1 {
        margin: 0;
      }
      .container {
        display: grid;
        height: 100vh;
        margin: 0;
      }
      section.main {
        user-select: none;
        margin: auto;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      section.main > * {
        margin: 12px 0;
      }
      h1.title {
        font-size: 32px;
        color: var(--color-accent);
      }
      p.description {
        font-size: 16px;
        max-width: 600px;
      }

      @media(min-width: 700px) {
        h1.title {
          font-size: 48px;
          color: var(--color-accent);
        }
        p.description {
          font-size: 20px;
        }
      }
    `}</style>
  {/* 40a042 */}
  </>
}

export default Index