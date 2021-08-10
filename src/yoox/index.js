import { Subject } from 'rxjs'
import { scan, startWith, shareReplay } from 'rxjs/operators'
import { createStoreAccessors } from '../utils'
/**
 * Create a rxjs redux-like yoox
 * @returns {Observable}
 */
const store = (modules) => {
    const storeInstance = new Subject()
    const storeAccessors = createStoreAccessors(modules)
    /**
     * Create a reducer according to module action by type
     * @param state
     * @param action
     * @returns {*}
     */
    const reducer = (state = storeAccessors.initialState, action) => {
        const DEFAULT_STATE = state => state
        const handler = storeAccessors.setterList[action.type] || DEFAULT_STATE
        return handler(state, action)
    }

    /**
     * Creating a yoox instance with pipe rxjs methods
     * @type {Observable}
     */
    const store = storeInstance.pipe(
        startWith({type: '__INIT__'}),
        scan(reducer, undefined),
        shareReplay(1)
    )

    /**
     * Creating a dispatch event to emulate redux-like design pattern
     * @param action
     */
    store.dispatch = (action) => storeInstance.next(action)

    /**
     * Create a get event as alias shorthand for returning get functions from modules
     * @param action
     * @returns {*}
     */
    store.get = (action) => {
      const isModularizedFunction = action.split('').includes('/')
      let generalState = {}

      if (isModularizedFunction) {
        const moduleName = action.split('/')[0] || ''
        generalState = { state: store.state[moduleName], rootState: store.state }
      } else {
        generalState.state = store.state
      }

      return storeAccessors.getterList[action]
        ? storeAccessors.getterList[action](generalState)
        : console.warn('[Perse SDK Store] The get method ', action, ' does not exist.')
    }

    /**
     * Create a mix event as alias shorthand for next/dispatch
     * @param action
     * @param payload
     */
    store.mix = (action, payload) => {
        payload
            ? storeInstance.next({ type: action, payload })
            : storeInstance.next({ type: action })
    }

    /**
     * Create a set action event
     * @param action
     * @param payload
     * @returns {*}
     */
    store.set = (action, payload) =>
      storeAccessors.actionList[action]
            ? storeAccessors.actionList[action](store, payload)
            : console.warn('[Perse SDK Store] The set method ', action, ' does not exist.')

    /**
     * Create a subscription stream const to be reused
     * @param subscriptionHandler
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
