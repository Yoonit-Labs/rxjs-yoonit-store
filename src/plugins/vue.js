export const VueInstall = {
  install (Vue, storeInstance) {
    Vue.prototype.$Yoox = new Vue({

      data() {
        return {
          localState: {},
          localStore: undefined
        }
      }, // data

      methods: {
        /**
         * Returns the get method of a given get name
         * @param payload
         * @returns {*}
         */
        get(payload) {
          return this.localStore.get(payload)
        },

        /**
         * Returns the mix method of a given name
         * @param action
         * @param payload
         * @returns {*}
         */
        mix(action, payload) {
          return this.localStore.mix(action, payload)
        },

        /**
         * Update yoox according to action name and payload
         * @param action
         * @param payload
         * @returns {*}
         */
        set(action, payload) {
          return this.localStore.set(action, payload)
        }
      }, // methods

      computed: {
        /**
         * Returns local state with vue reactivity
         * @returns {{}|*}
         */
        state() {
          return this.localState
        }
      }, // computed

      created() {
        /**
         * Observe to update yoox and state on changes
         */
        storeInstance.observe((state) => {
          this.localStore = storeInstance
          this.localState = state
        })
      }, // created

    }) // Vue.prototype.$Yoox
  }, // install ()
} // export const VueInstall

export default VueInstall
