/**
 * @description Receive Store as parameter and create store methods to be used by user.
 * @param {Object} store - Raw state values
 * @param {Object} storeAccessors - Accessors methods passed as params to createStore method
 * @param {Observable} storeObservable - Observable that updates store state
 * @returns {{set: (function(*=, *=): *|void), get: (function(*=): *|void), mix: ((function(*=, *=): (*|undefined))|*)}}
 */
function createStoreMethods ({ store, storeAccessors, storeObservable }) {
  const _store = store
  const _storeAccessors = storeAccessors
  const _storeObservable = storeObservable

  return {
    /**
     * Create a get event as alias shorthand for returning get functions from modules
     * @param {string} action
     * @returns {*}
     */
    get: function (action) {
      const isModularizedFunction = action.split('').includes('/')
      let globalState = {}

      if (isModularizedFunction) {
        const moduleName = action.split('/')[0] || ''
        globalState = { state: _store.state[moduleName], rootState: _store.state }
      } else {
        globalState.state = _store.state
      }

      return _storeAccessors.getterList[action]
        ? _storeAccessors.getterList[action](globalState)
        : console.warn('[Perse SDK Store] The get method ', action, ' does not exist.')
    },

    /**
     * Create a mix event as alias shorthand for next/dispatch
     * @param {string} action
     * @param {Object} payload
     */
    mix: function (action, payload) {
      if (payload) {
        return _storeObservable.next({ type: action, payload })
      }

      _storeObservable.next({ type: action })
    },

    /**
     * Create a set action event
     * @param {string} action
     * @param {Object} payload
     * @returns {*}
     */
    set: function (action, payload) {
      return _storeAccessors.actionList[action]
        ? _storeAccessors.actionList[action](store, payload)
        : console.warn('[Perse SDK Store] The set method ', action, ' does not exist.')
    }
  }
}

export default createStoreMethods
