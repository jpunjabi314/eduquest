import { FC } from 'react'


interface Props {
  visible: boolean,
  items: {
    callback?: () => void
    label: string
  }[]
}

const Dropdown: FC<Props> = ({
  visible,
  items
}: Props) => (
  <>
    <div>
      <ul>
        { items.map(item => {
          return <li key={item.label} onClick={item.callback} style={{
            cursor: 'pointer'
          }}>{item.label}</li>
        })}
      </ul>
    </div>
    <style jsx>{`
      div {
        display: ${visible ? 'flex' : 'none'};
        position: absolute;
        top: 60px;
        right: 30px;
        background: var(--color-background-alt);
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0px;
      }
      li {
        padding: 16px;
      }
    `}</style>
  </>
)

export default Dropdown