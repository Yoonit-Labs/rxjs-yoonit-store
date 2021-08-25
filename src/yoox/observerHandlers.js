import Persist from "../persist/main";

function createObserverHandlers (storeAccessors) {
  const _storeAccessors = storeAccessors

  return {
    /**
     * Create a handler to execute mixer
     * @param {Observable} state
     * @param {string} action
     * @returns {*}
     */
    mixerHandler: function (state, action) {
      const DEFAULT_STATE = state => state
      const handler = _storeAccessors.setterList[action.type] || DEFAULT_STATE
      handler(state, action)
      return state
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
