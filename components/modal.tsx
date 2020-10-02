import { useAuthState } from 'react-firebase-hooks/auth'
import firebase, { authProviders } from 'lib/client/firebase'
import { loginWith } from 'lib/client/helpers'
import { useRedirect, useRequireNoUser } from 'lib/client/hooks'

import { FC, ReactNode } from 'react'

interface Props {
  title: string,
  children: ReactNode,
  visible: boolean,
  controls: ReactNode,
  setVisible?: (visible: boolean) => void
}

const Modal: FC<Props> = ({
  title,
  children,
  controls,
  visible,
  setVisible
}: Props) => (
  <div className="modal">
    <div className='overlay'>
      
    </div>
  </div>
)

export default Modal