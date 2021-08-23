import { Subject } from 'rxjs'
import { scan, startWith, shareReplay } from 'rxjs/operators'
import { createStoreAccessors, loadPersistedData } from '../utils'
import createStoreMethods from './methods'
import createObserverHandlers from './observerHandlers'

/**
 * Create a rxjs redux-like yoox
 * @param {Object} modules
 * @param {Object} config
 * @returns {Observable}
 */
const store = async (modules, { persist = false }) => {
    const storeObservable = new Subject()
    const storeAccessors = createStoreAccessors(modules)
    const persistedData = await loadPersistedData(storeAccessors.modules)
    const observerHandlers = createObserverHandlers(storeAccessors)

    // Load persisted data
    if (persist && persistedData) {
      storeAccessors.initialState = persistedData
    }

    const persistStoreState = persist
      ? observerHandlers.persistStoreState
      : (acc, value) => { return value }

    /**
     * Creating a yoox instance with pipe rxjs methods
     * @type {Observable}
     */
    const store = storeObservable.pipe(
        startWith({type: '__INIT__'}),
        scan(observerHandlers.reducer, storeAccessors.initialState),
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
