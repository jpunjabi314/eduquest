export interface Classroom {
  owner: User
  id: string
  name: string
  members: string[]
  complex: Member[]
}

export interface SensoredClassroom {
  owner: User
  id: string
  name: string
  points: number
}

export interface User {
  uid: string
  name: string
}
export interface Member {
  uid: string
  points: number
  name: string
}

export interface GiftCard {
  card: string
  pin: string
  kind: string
}