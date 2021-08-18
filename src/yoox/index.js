import { Subject } from 'rxjs'
import { scan, startWith, shareReplay } from 'rxjs/operators'
import { createStoreAccessors, loadPersistedData } from '../utils'
import Persist from '../persist/main'
import isEqual from 'lodash.isequal'

/**
 * Create a rxjs redux-like yoox
 * @param {Object} modules
 * @param {Object} config
 * @returns {Observable}
 */
const store = async (modules, { persist = false }) => {
    const storeInstance = new Subject()
    const storeAccessors = createStoreAccessors(modules)
    const definedStateAtCreation = JSON.parse(JSON.stringify(storeAccessors.initialState))
    const persistedData = await loadPersistedData()

    // Load persisted data
    if (persist && persistedData) {
      storeAccessors.initialState = persistedData
    }

    /**
     * Create a reducer according to module action by type
     * @param {Observable} state
     * @param {string} action
     * @returns {*}
     */
    const reducer = (state, action) => {
        const DEFAULT_STATE = state => state
        const handler = storeAccessors.setterList[action.type] || DEFAULT_STATE
        return handler(state, action)
    }

    /**
     * Persist
     * @param {Object} accumulator
     * @param {Object} value
     * @returns {*}
     */
    const persistStoreState = (accumulator, value) => {
      if (isEqual(value, definedStateAtCreation) || !persist) {
        return value
      }

      setTimeout(() => Persist.set(value), 500)
      return value
    }

    /**
     * Creating a yoox instance with pipe rxjs methods
     * @type {Observable}
     */
    const store = storeInstance.pipe(
        startWith({type: '__INIT__'}),
        scan(reducer, storeAccessors.initialState),
        shareReplay(1),
        scan(persistStoreState, {})
    )

    /**
     * Create a get event as alias shorthand for returning get functions from modules
     * @param {string} action
     * @returns {*}
     */
    store.get = (action) => {
      const isModularizedFunction = action.split('').includes('/')
      let globalState = {}

      if (isModularizedFunction) {
        const moduleName = action.split('/')[0] || ''
        globalState = { state: store.state[moduleName], rootState: store.state }
      } else {
        globalState.state = store.state
      }

      return storeAccessors.getterList[action]
        ? storeAccessors.getterList[action](globalState)
        : console.warn('[Perse SDK Store] The get method ', action, ' does not exist.')
    }

    /**
     * Create a mix event as alias shorthand for next/dispatch
     * @param {string} action
     * @param {Object} payload
     */
    store.mix = (action, payload) => {
      if (payload) {
        return storeInstance.next({ type: action, payload })
      }

      storeInstance.next({ type: action })
    }

    /**
     * Create a set action event
     * @param {string} action
     * @param {Object} payload
     * @returns {*}
     */
    store.set = (action, payload) =>
      storeAccessors.actionList[action]
            ? storeAccessors.actionList[action](store, payload)
            : console.warn('[Perse SDK Store] The set method ', action, ' does not exist.')

    /**
     * Create a subscription stream const to be reused
     * @param {Function} subscriptionHandler
     * @returns {*}
     */
    const subscription = async (subscriptionHandler) => await store.subscribe(subscriptionHandler)

    /**
     * Create a observe method to return our subscription changes
     * @type {function(*=): *}
     */
    store.observe = subscription

    /**
     * Update a local state object in yoox on subscription change
     */
    subscription((state) => store.state = state)

    return store
}

export { store }
