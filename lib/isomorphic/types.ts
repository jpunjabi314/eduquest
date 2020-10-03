export interface Classroom {
  owner: User
  id: string
  name: string
  members: string[] // List of user UID's
}

export interface SensoredClassroom {
  owner: User
  id: string
  name: string
}

export interface User {
  uid: string
  name: string
}