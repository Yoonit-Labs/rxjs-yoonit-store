export const VueNextInstall = {
  install: (app, storeInstance) => {
    app.mixin({
      data () {
        return {
          localState: {},
          __Yoox: undefined
        }
      },
      created () {
        /**
         * Observe to update yoox and state on changes
         */
        storeInstance.observe((state) => {
          this.localState = { ...state }
          this.__Yoox = { ...storeInstance }
        })
      },
      computed: {
        /**
         * Returns local state with vue reactivity
         * @returns {{}|*}
         */
        state () {
          return this.localState
        }
      }, // computed
      methods: {
        /**
         * Returns the get method of a given get name
         * @param payload
         * @returns {*}
         */
        get (payload) {
          return this.__Yoox.get(payload)
        },

        /**
         * Returns the mix method of a given name
         * @param action
         * @param payload
         * @returns {*}
         */
        mix (action, payload) {
          return this.__Yoox.mix(action, payload)
        },

        /**
         * Update yoox according to action name and payload
         * @param action
         * @param payload
         * @returns {*}
         */
        set (action, payload) {
          return this.__Yoox.set(action, payload)
        }
      }
    })
  }
}

export default VueNextInstall
