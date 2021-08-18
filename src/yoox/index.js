import { Subject } from 'rxjs'
import { scan, startWith, shareReplay } from 'rxjs/operators'
import { createStoreAccessors, loadPersistedData } from '../utils'
import Persist from '../persist/main'
import isEqual from 'lodash.isequal'
import createStoreMethods from './methods'

/**
 * Create a rxjs redux-like yoox
 * @param {Object} modules
 * @param {Object} config
 * @returns {Observable}
 */
const store = async (modules, { persist = false }) => {
    const storeObservable = new Subject()
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

      setTimeout(function () { Persist.set(value) }, 500)
      return value
    }

    /**
     * Creating a yoox instance with pipe rxjs methods
     * @type {Observable}
     */
    const store = storeObservable.pipe(
        startWith({type: '__INIT__'}),
        scan(reducer, storeAccessors.initialState),
        shareReplay(1),
        scan(persistStoreState, {})
    )

    const storeMethods = createStoreMethods({
      store,
      storeAccessors,
      storeObservable
    })

    store.get = storeMethods.get

    store.mix = storeMethods.mix

    store.set = storeMethods.set

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
