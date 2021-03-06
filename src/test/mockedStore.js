export const storeWithModule = {
  user: {
    state: {
      name: '',
      age: ''
    },
    set: {
      'personalData': function ({ mix }, user) {
        mix('user/personalData', user)
      },
      'changeName': function ({ set, get }, userName) {
        const user = { ...get('user/personalData') }

        user.name = userName
        set('user/personalData', user)
      }
    },
    get: {
      'personalData': function ({ state }) {
        return state
      }
    },
    mix: {
      'personalData': function (state, { payload }) {
        state.user.name = payload.name
        state.user.age = payload.age
      }
    }
  }
}

export const rootAccessors = {
  state: {
    user: {
      name: '',
      age: ''
    }
  },
  set: {
    'userPersonalData': function ({ mix }, user) {
      mix('userPersonalData', user)
    }
  },
  get: {
    'userPersonalData': function ({ state }) {
      return state.user
    }
  },
  mix: {
    'userPersonalData': function (state, { payload }) {
      state.user = payload
    }
  }
}

export const officeStore = {
  office: {
    state: {
      name: ''
    },
    set: {
      'officeData': function ({ mix }, user) {
        mix('office/officeData', user)
      }
    },
    get: {
      'data': function ({ state }) {
        return state
      }
    },
    mix: {
      'officeData': function (state, { payload }) {
        state.user.name = payload.name
      }
    }
  }
}

export const mixedStore = {
  office: {
    state: {
      name: ''
    },
    set: {
      'officeData': function ({ mix }, user) {
        mix('office/officeData', user)
      }
    },
    get: {
      'data': function ({ state }) {
        return state
      }
    },
    mix: {
      'officeData': function (state, { payload }) {
        state.office.name = payload.name
      }
    }
  },
  user: {
    state: {
      name: '',
      age: ''
    },
    set: {
      'personalData': function ({ mix }, user) {
        mix('user/personalData', user)
      },
      'changeName': function ({ set, get }, userName) {
        const user = { ...get('user/personalData') }

        user.name = userName
        set('user/personalData', user)
      }
    },
    get: {
      'personalData': function ({ state }) {
        return state
      }
    },
    mix: {
      'personalData': function (state, { payload }) {
        state.user.name = payload.name
        state.user.age = payload.age
      }
    }
  }
}
