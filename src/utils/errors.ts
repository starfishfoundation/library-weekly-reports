export const classSym = Symbol('class')

export class ImportError extends Error {
  level: string
  data: any
  [extraData: string]: any

  constructor(msg, { cause = undefined, level = 'error', ...data }) {
    super(msg, { cause })
    this.level = level
    this.data = data
  }

  serialize() {
    return {
      message: this.message,
      cause: this.cause,
      level: this.level,
      data: this.data,
    }
  }
}
