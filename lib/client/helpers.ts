import firebase from 'lib/client/firebase'

import { User } from 'firebase'
import { Spacing } from 'lib/client/types'

import Swal from 'sweetalert2'

export const loginWith = (provider: firebase.auth.AuthProvider) => async () => {
  const { user } = await firebase.auth().signInWithPopup(provider)
  return user
}

export const authedDataFetcher = async (endpoint: string, user: User | null, payload?: {}) => {
  if (!user) return null
  const idToken = await user.getIdToken()

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...payload,idToken })
  })
  const text = await res.text()

  if (!res.ok) {
    // TODO: Proper error handling
    throw new Error(`Error ${res.status}: ${text}`)
    // try {
    //   const message = JSON.parse(text).message || ""
    //   sendMessage("Error: ", message, 'error')
    // } catch {

    // }
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Error parsing JSON: ${text}`)
  }
}

export const logout = () => firebase.auth().signOut()

export const generateSpacing = (space: Spacing) => {
  const addPx = (a?: string | number) => a ? a + 'px' : null
  let trbl = []
  if(space.t) {
    if(typeof space.t === 'number') trbl.push(space.t + 'px')
    else { trbl.push(`var(--size-${space.t})`)}
  } else {
    trbl.push(addPx(space.y) || 0)
  }
  if(space.r) {
    if(typeof space.r === 'number') trbl.push(space.r + 'px')
    else { trbl.push(`var(--size-${space.r})`)}
  } else {
    trbl.push(addPx(space.x) || 0)
  }
  if(space.b) {
    if(typeof space.b === 'number') trbl.push(space.b + 'px')
    else { trbl.push(`var(--size-${space.b})`)}
  } else {
    trbl.push(addPx(space.y) || 0)
  }
  if(space.l) {
    if(typeof space.l === 'number') trbl.push(space.l + 'px')
    else { trbl.push(`var(--size-${space.l})`)}
  } else {
    trbl.push(addPx(space.x) || 0)
  }

  return trbl.reduce((acc, value) => `${acc} ${value}`)
}

export const sendMessage = (title?: string, text?: string, kind: 'error' | 'warning' | 'success' = 'error') => {
  Swal.fire({
    title: title,
    text: text,
    icon: kind,
    position: 'bottom-right',
    background: 'var(--color-background-alt)',
    toast: true,
    showConfirmButton: false,
    timer: 2500
  })
}