import { ObjectId } from 'mongodb'

export type BaseEntity = {
  _id?: ObjectId
  createdAt?: Date
  updatedAt?: Date
}

export interface IError {
  statusCode: number
  error: string
  message: string
}
