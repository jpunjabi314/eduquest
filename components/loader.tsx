import { FC } from "react"
import Box from "components/box"

interface Props {
  text?: string
}

const Loader: FC<Props> = ({
  text = "Loading..."
}: Props) => (
  <div className="container">
    <div className="spinner" />
    <div className="loader">{text}</div>
    
    <style jsx>{`
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }  
    .loader {
      user-select: none;
      pointer-events: none;
    }
    .spinner {
      box-sizing: border-box;
      border: 2px solid transparent;
      border-top: 2px solid var(--color-foreground);
      border-radius: 50%;
      width: 1.5em;
      height: 1.5em;
      animation: spin 3s linear infinite;
      margin-right: 8px;
      animation: spin 1000ms linear infinite;
    }
    .container {
      display: flex;
      alight-items: center;
      flex-direction: row;
    }
    `}</style>
  </div>
)

export const FullscreenLoader: FC<Props> = (props: Props) => (
  <div>
    <Loader {...props} />
    <style jsx>{`
      div {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </div>
)


export default Loader