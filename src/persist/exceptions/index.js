function NotFoundException () {
  this.code = 404
  this.message = 'Registry was not found'
}

function UnexpectedErrorException (message) {
  this.message = message
}

/**
 * @function catchError
 * @description Handle error and throw custom error exception.
 * @param {Error} error
 * @returns {UnexpectedErrorException|NotFoundException}
 */
function catchError (error) {
  if (error.status === 404) {
    return new NotFoundException()
  }

  return new UnexpectedErrorException(error.message)
}

export {
  NotFoundException,
  UnexpectedErrorException,
  catchError
}
