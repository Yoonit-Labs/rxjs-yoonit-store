import * as Yoox from './main'
import { mixedStore, officeStore, rootAccessors, storeWithModule } from "./test/mockedStore"
import Persist from './persist/main'
import { delay } from "./test/helpers"
import { NotFoundException } from "./persist/exceptions"

describe('Testing Yoox modularized', () => {
  it('Should create yoox from object', async() => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

    expect(myYoox.get('user/personalData')).toStrictEqual({ name: '', age: ''})
  })

  it('Should set user name and age', async () => {
    const myYoox = await Yoox.store(storeWithModule, { persist: false })

    myYoox.set('user/personalData', { name: 'Gabriel Rizzo', age: '25' })

    expect(myYoox.get('user/personalData')).toStrictEqual({ name: 'Gabriel Rizzo', age: '25' })
  })

  it('Should call another setter inside changeName', async () => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

    await myYoox.set('user/personalData', { name: 'Gabriel Rizzo', age: '25' })

    await myYoox.set('user/changeName', 'Yooni the Goat')

    expect(myYoox.get('user/personalData')).toStrictEqual({ name: 'Yooni the Goat', age: '25' })
  })

  it('Should set user and be accessible through state key', async () => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

    myYoox.set('user/personalData', { name: 'Gabriel Rizzo', age: '25' })

    expect(myYoox.state.user).toStrictEqual({ name: 'Gabriel Rizzo', age: '25' })
  })
})

describe('Testing Yoox with root accessors',() => {
  it('Should set user data to store', async () => {
    const myYoox = await Yoox.store(rootAccessors, { persist: true })

    myYoox.set('userPersonalData', { name: 'Gabriel Santiago', age: '25' })

    expect(myYoox.get('userPersonalData')).toStrictEqual({ name: 'Gabriel Santiago', age: '25' })
  })
})

describe('Testing Store Persistence', () => {
  it('Should save value', async () => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

    await delay()

    await myYoox.set('user/personalData', { name: 'Gabriel Rizzo', age: '25' })

    await delay()

    const persistedValue = await Persist.get()
    expect(persistedValue.user).toStrictEqual({ name: 'Gabriel Rizzo', age: '25' })
  })

  it('Should save latest value', async () => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

    await myYoox.set('user/personalData', { name: 'Gabriel Rizzo', age: 25 })

    await myYoox.set('user/personalData', { name: 'Yooni the Goat', age: 1 })

    await delay()

    const persistedValue = await Persist.get()

    expect(persistedValue.user).toStrictEqual({name: 'Yooni the Goat', age: 1 })
  })

  it('Should set persisted value to start value', async () => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

    await myYoox.set('user/personalData', { name: 'Gabriel Rizzo', age: 25 })

    await myYoox.set('user/personalData', { name: '', age: '' })

    await delay()

    const persistedValue = await Persist.get()

    expect(persistedValue.user).toStrictEqual({ name: '', age: '' })
  })

  it('Store with different modules should not load persisted data', async () => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

    await myYoox.set('user/personalData', { name: 'Lucas', age: 40 })

    delay()

    const myAnotherYoox = await Yoox.store(officeStore, { persist: true })

    expect(myAnotherYoox.get('office/data')).toStrictEqual({ name: '' })
  })
})

describe('Testing store with more then one module', () => {
  it('Should create store with both states', async () => {
    const myYoox = await Yoox.store(mixedStore, { persist: false })
  })

  it('Should set value to correct module', async () => {
    const myYoox = await Yoox.store(mixedStore, { persist: false })

    myYoox.set('user/personalData', { name: 'Gabriel Santiago', age: 25 })
    myYoox.set('office/officeData', { name: 'Cyberlabs' })

    expect(myYoox.state).toStrictEqual({
      office: { name: 'Cyberlabs' },
      user: { name: 'Gabriel Santiago', age: 25 }
    })
  })
})


describe('Testing Persist setter', () => {
  it('Should set data on store when persist is empty', async () => {
    const cacheResult = await Persist.set({
      state: {
        user: {
          name: 'Gabriel Rizzo',
          age: 25
        }
      }
    })

    expect(cacheResult).toBeTruthy()
  })

  it('Should update data on store', async () => {
    const expectedValue = {
      state: {
        group: {
          id: 1,
          name: 'Happy Group'
        }
      }
    }

    await Persist.set({
      state: {
        user: {
          name: 'Gabriel Rizzo',
          age: 25
        }
      }
    })

    await Persist.set(expectedValue)

    const cachedValue = await Persist.get()

    expect(cachedValue).toStrictEqual(expectedValue)
  })
})

describe('Testing Persist getter', () => {
  it('Should get cached value', async () => {
    const expectedValue = {
      state: {
        group: {
          id: 1,
          name: 'Happy Group'
        }
      }
    }

    await Persist.set(expectedValue)

    const cachedData = await Persist.get()

    expect(cachedData).toStrictEqual(expectedValue)
  })

  it('Should return error when there is no cached value', async () => {
    try {
      // setting value to guarantee that store is not empty
      await Persist.set({ value: true })

      // Cleaning persist
      await Persist.clear()

      await Persist.get()
    } catch (e) {
      expect(e instanceof NotFoundException).toBeTruthy()
    }
  })
})

describe('Testing clear persist', () => {
  it('Should clear stored value', async () => {
    await Persist.set({ value: true })

    const clearPersistResult = await Persist.clear()

    expect(clearPersistResult).toBeTruthy()
  })
})
