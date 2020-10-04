import { Color, Size, Spacing } from 'lib/client/types'
import { generateSpacing } from 'lib/client/helpers'
import { FC, MouseEventHandler, ReactNode } from 'react'


interface Props {
  text?: string,
  bg?: Color,
  fg?: Color,
  fontSize?: Size,
  fontWeight?: number
  m?: Spacing,
  p?: Spacing
  onClick?: MouseEventHandler,
  children: ReactNode
}

const Button: FC<Props> = ({
  children,
  bg = "background-alt",
  fg = "foreground",
  fontSize = "md",
  fontWeight = 500,
  m = {
    t: 4,
    r: 4,
    b: 4,
    l: 4
  },
  p = {
    t: 8,
    r: 16,
    b: 8,
    l: 16
  },
  onClick
}: Props) => (
  <>
    <button onClick={onClick}>
      { children }
    </button>
    <style jsx>{`
      button {
        color: var(--color-${fg});
        background: var(--color-${bg});
        font-size: var(--size-${fontSize});
        font-weight: ${fontWeight};

        margin: ${generateSpacing(m)};
        padding: ${generateSpacing(p)};
        border: none;
        cursor: pointer;
        border-radius: 5px;

        transition: filter .4s;
      }

      button:hover {
        filter: brightness(1.1)
      }
    `}</style>
  </>
)

export default Button