import { Color, Size, Spacing } from 'lib/client/types'
import { generateSpacing } from 'lib/client/helpers'
import { FC, MouseEventHandler, ReactNode } from 'react'


interface Props {
  text?: string,
  bg?: Color,
  fg?: Color,
  fontSize?: Size,
  m?: Spacing,
  p?: Spacing,
  maxWidth?: number,
  children: ReactNode,
  onClick: () => void
}

const Box: FC<Props> = ({
  children,
  bg = "background",
  fg = "foreground",
  fontSize = "md",
  m = {},
  p = {},
  maxWidth,
  onClick
}: Props) => (
  <>
    <div onClick={onClick}>
      {children}
    </div>
    <style jsx>{`
      div {
        color: var(--color-${fg});
        background: var(--color-${bg});
        font-size: var(--size-${fontSize});

        margin: ${generateSpacing(m)};
        padding: ${generateSpacing(p)};
        ${maxWidth ? `max-width: ${maxWidth}px;` : ''}
      }
    `}</style>
  </>
)

export default Box