import { FC, ReactNode } from 'react'
import Box from './box'

interface Props {
  title: string,
  children: ReactNode,
  visible: boolean,
  controls: ReactNode,
  setVisible?: (visible: boolean) => void
}

const Modal: FC<Props> = ({
  children,
  controls,
  visible,
  title,
  setVisible
}: Props) => (
  <div className="container">
    <div className='overlay' onClick={() => setVisible && setVisible(false)} />
    <Box bg="background" p={{x: 20, y: 20}} maxWidth={600}> 

    <h2>{title}</h2>
      <Box>
        { children }
      </Box>
      <Box>
        { controls}
      </Box>
    </Box>

    <style jsx>{`
    @keyframes fade {
        0% {
          display: none;
          opacity: 0;
        }
        100% {
          display: flex;
          opacity: 1;
        }
      }
      .container {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        display: ${visible ? 'flex' : 'none'};
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 0;
      }
      .overlay {
        background: #000000dd;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: -1;
      }
      .modal {
        width: 100%;
        max-width: 600px;
        border-radius: 12px;
      }
    `}</style>
  </div>
)

export default Modal