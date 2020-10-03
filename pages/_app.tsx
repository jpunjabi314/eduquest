import { AppProps } from 'next/app'

import { FC } from 'react'

import 'styles/global.css'
import 'styles/inter.css'
import 'styles/variables.css'

const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => <Component {...pageProps} />

export default App
