import Persist from "../persist/main";

function createObserverHandlers (storeAccessors) {
  const _storeAccessors = storeAccessors

  return {
    /**
     * Create a reducer according to module action by type
     * @param {Observable} state
     * @param {string} action
     * @returns {*}
     */
    reducer: function (state, action) {
      const DEFAULT_STATE = state => state
      const handler = _storeAccessors.setterList[action.type] || DEFAULT_STATE
      return handler(state, action)
    },

    /**
     * Persist value inside store
     * @param {Object} accumulator
     * @param {Object} value
     * @returns {*}
     */
    persistStoreState: function (accumulator, value) {
      Persist.set(value)
      return value
    }
  }
}

export default createObserverHandlers
