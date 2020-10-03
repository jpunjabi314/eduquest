import { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode,
}

const Container: FC<Props> = ({
  children
}: Props) => (
  <main>
    { children }
    <style jsx>{`
      main {
        padding: 24px;
      }  
    `}</style>
  </main>
)

export default Container