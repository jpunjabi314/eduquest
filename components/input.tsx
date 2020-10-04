import { ChangeEvent, FC } from 'react'
import Box from 'components/box'
import { Color } from 'lib/client/types'

type Props = {
  id: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  label: string
  placeholder?: string
  type?: 'text' | 'password',
  background?: Color
  color?: Color
  width?: string | number
  border?: boolean
}

const Input: FC<Props> = ({
  type = 'text',
  id,
  value,
  onChange,
  label,
  placeholder,
  background = "background-alt",
  color = "foreground",
  width = "100%",
  border = false
}: Props) => (
  <Box bg="none">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />

    <style jsx>{`
      label {
        user-select: none;
        display: block;
        font-size: 1rem;
        font-weight: 600;
        background: none;
      }
      input {
        background: var(--color-${background});
        color: var(--color-${color});
        display: block;
        border: none;
        font-family: inherit;
        font-size: 1rem;
        font-weight: 400;
        padding: 8px 20px;
        border-radius: 8px;
        width: ${width};
        ${ border ? `border: 2px rgba(100,100,100,.1) solid` : ''}
      }
      ::placeholder {
        user-select: none;
        color: var(--fg-silent);
      }
    `}</style>
  </Box>
)

export default Input