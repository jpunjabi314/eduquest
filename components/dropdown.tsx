import { FC } from 'react'


interface Props {
  visible: boolean,
  items: {
    callback?: () => void
    label: string
  }[],
  width?: number,
  top?: number,
  setVisible?: (visible: boolean) => void
}

const Dropdown: FC<Props> = ({
  visible,
  items,
  width = 125,
  top = 40,
  setVisible
}: Props) => (
  <>
    <div className='overlay' onClick={() => setVisible && setVisible(false)} />
    <div className='dropdown'>
      <ul>
        { items.map(item => {
          return <li key={item.label} onClick={item.callback} style={{
            cursor: 'pointer'
          }}>{item.label}</li>
        })}
      </ul>
    </div>
    <style jsx>{`
      div.dropdown {
        display: ${visible ? 'flex' : 'none'};
        position: absolute;
        background: var(--color-background-alt);
        top: ${top}px;
        right: 0;
      }
      .overlay {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: -1;
        display: ${visible ? 'block' : 'none'}
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0px;
      }
      li {
        padding: 16px 4px 16px 16px;
        transition: filter .4s;
        background: var(--color-background-alt);
        width: ${width}px;
      }

      li:hover {
        filter: brightness(1.25);
      }
    `}</style>
  </>
)

export default Dropdown