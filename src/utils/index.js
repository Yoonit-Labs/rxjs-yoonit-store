/**
 * @description Create object with domain name '/' function's name
 * @param {Object} accessors Object with getters, setters or mixers
 * @param {string} moduleName Module name.
 * @returns Object
 */
import {Persist} from "../persist/main";

function modularizeFunctionNames (accessors, moduleName) {
  const modularizedFunctions = {}
  Object.keys(accessors).forEach((functionName) => {
    modularizedFunctions[`${moduleName}/${functionName}`] = accessors[functionName]
  })

  return modularizedFunctions
}

/**
 * @description Create store accessors
 * @param {Object} modules
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

const loadPersistedData = async () => {
  try {
    return Persist.get()
  } catch (e) {
    return false
  }
}

export {
  createStoreAccessors,
  modularizeFunctionNames,
  loadPersistedData
}
