/**
 * @description Compare determined keys array with generated accessors keys from createStoreAccessors object
 * @param {Array} expectedAccessors Expected Accessors from test
 * @param {Object} generatedAccessors Accessors generated by createStoreAccessors function
 * @returns {boolean}
 */
const areAccessorsKeysEquals = (expectedAccessors, generatedAccessors) => {
  const actionListMatched = areArraysEquals(expectedAccessors.actionList, Object.keys(generatedAccessors.actionList))
  const getterListMatched = areArraysEquals(expectedAccessors.getterList, Object.keys(generatedAccessors.getterList))
  const setterListMatched = areArraysEquals(expectedAccessors.setterList, Object.keys(generatedAccessors.setterList))
  const initialStateMatched = areArraysEquals(expectedAccessors.initialState, Object.keys(generatedAccessors.initialState))

  return actionListMatched && getterListMatched && setterListMatched && initialStateMatched
}

/**
 * @description Compare array keys
 * @param {Array} firstArray
 * @param {Array} secondArray
 * @returns {boolean}
 */
const areArraysEquals = (firstArray, secondArray) => {
  return firstArray.sort().join('') === secondArray.sort().join('')
}

/**
 * @description Delay function with 1 second timeout
 * @returns {Promise<unknown>}
 */
const delay = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 3000)
  })
}

export {
  areArraysEquals,
  areAccessorsKeysEquals,
  delay
}
