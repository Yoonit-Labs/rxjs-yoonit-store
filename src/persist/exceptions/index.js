function NotFoundException () {
  this.code = 404
  this.message = 'Registry was not found'
}

function ConflictException () {
  this.code = 409
  this.message = 'Document update conflict'
}

function UnexpectedErrorException (message) {
  this.message = message
}

/**
 * @function catchError
 * @description Handle error and throw custom error exception.
 * @param {Error} error
 * @returns {UnexpectedErrorException|NotFoundException|ConflictException}
 */
function catchError (error) {
  if (error.status === 404) {
    return new NotFoundException()
  }

  if (error.status === 409) {
    return new ConflictException()
  }

  return new UnexpectedErrorException(error.message)
}

export {
  NotFoundException,
  UnexpectedErrorException,
  ConflictException,
  catchError
}
