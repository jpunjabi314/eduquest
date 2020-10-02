import { AppProps } from 'next/app'

import 'water.css/out/dark.min.css'

import { FC} from 'react'

const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => <Component {...pageProps} />

export default App
