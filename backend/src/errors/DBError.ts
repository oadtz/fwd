import { IError } from '../types/common'

export default class DBError extends Error implements IError {
  public statusCode: number

  public error: string

  public message: string

  constructor(errorCode: number, message: string) {
    super(message)
    this.message = message
    this.setError(errorCode)
  }

  private setError = (errorCode: number): void => {
    let errorMessage = ''
    let statusCode = 500

    switch (errorCode) {
      case 11000:
        errorMessage = 'Conflict'
        statusCode = 409
        break
      default:
        errorMessage = 'Database error'
        statusCode = 500
    }

    this.error = errorMessage
    this.statusCode = statusCode
  }
}
