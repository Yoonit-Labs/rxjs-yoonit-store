import * as Yoox from './main'
import {officeStore, rootAccessors, storeWithModule} from "./test/mockedStore"
import Persist from './persist/main'
import { delay } from "./test/helpers"

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
  it('Should create yoox object', async () => {
    const myYoox = await Yoox.store(rootAccessors, { persist: true })

    await delay()
    const persistedValue = await Persist.get()

    expect(myYoox.get('userPersonalData')).toStrictEqual(persistedValue.user)
  })

  it('Should set user data to store', async () => {
    const myYoox = await Yoox.store(rootAccessors, { persist: true })

    myYoox.set('userPersonalData', { name: 'Gabriel Santiago', age: '25' })

    expect(myYoox.get('userPersonalData')).toStrictEqual({ name: 'Gabriel Santiago', age: '25' })
  })
})

describe('Testing Store Persistence', () => {
  it('Should save value', async () => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

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

  it('foo', async () => {
    const myYoox = await Yoox.store(rootAccessors, { persist: true })

    const persistedValue = await myYoox.get('userPersonalData')

    console.log(persistedValue)
  })

  it('Store with different modules should not load persisted data', async () => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

    await myYoox.set('user/personalData', { name: 'Lucas', age: 40 })

    delay()

    const myAnotherYoox = await Yoox.store(officeStore, { persist: true })

    console.log(myAnotherYoox.get('office/data'))
  })
})
