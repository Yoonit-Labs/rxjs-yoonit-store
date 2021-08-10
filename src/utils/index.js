/**
 * @description Create object with domain name '/' function's name
 * @param accessors Object with getters, setters or mixers
 * @param moduleName Module name.
 * @returns Object
 */
function modularizeFunctionNames (accessors, moduleName) {
  const modularizedFunctions = {}
  Object.keys(accessors).forEach((functionName) => {
    modularizedFunctions[`${moduleName}/${functionName}`] = accessors[functionName]
  })

  return modularizedFunctions
}

/**
 * @description Create store accessors
 * @param modules
 * @returns {{setterList: *, getterList, initialState, actionList}|{setterList, getterList, initialState, actionList: {}}}
 */
function createStoreAccessors (modules) {
  const moduleKeys = Object.keys(modules)
  const isAccessorsOnRoot = moduleKeys.includes('get') &&
    moduleKeys.includes('set') &&
    moduleKeys.includes('mix') &&
    moduleKeys.includes('state')

  let initialState, getterList, setterList, actionList = {}

  if (isAccessorsOnRoot) {

    return {
      getterList: modules.get,
      actionList: modules.set,
      initialState: modules.state,
      setterList: modules.mix
    }
  }
  // Populate setterList and initialState object according to modules
  moduleKeys.forEach((moduleKey) => {
    initialState = { ...initialState, [moduleKey]: { ...modules[moduleKey].state } }
    getterList = { ...getterList, ...modularizeFunctionNames(modules[moduleKey].get, moduleKey) }
    setterList = { ...setterList, ...modularizeFunctionNames(modules[moduleKey].mix, moduleKey) }
    actionList = { ...actionList, ...modularizeFunctionNames(modules[moduleKey].set, moduleKey) }
  })

  return {
    initialState,
    getterList,
    setterList,
    actionList
  }
}

export {
  createStoreAccessors,
  modularizeFunctionNames
}
