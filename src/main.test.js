import * as Yoox from './main'
import { rootAccessors, storeWithModule } from "./test/mockedStore";
import Persist from './persist/main'

describe('Testing Yoox modularized', () => {
  it('Should create yoox from object', async() => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

    const persistedData = await Persist.get()

    expect(myYoox.get('user/personalData')).toStrictEqual(persistedData.user)
  })

  it('Should set user name and age', async () => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

    myYoox.set('user/personalData', { name: 'Gabriel Rizzo', age: '25' })

    expect(myYoox.get('user/personalData')).toStrictEqual({ name: 'Gabriel Rizzo', age: '25' })
  })

  it('Should call another setter inside changeName', async () => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

    myYoox.set('user/personalData', { name: 'Gabriel Rizzo', age: '25' })

    myYoox.set('user/changeName', 'Yooni the Goat')

    const foo = await Persist.get()

    console.log('foo', foo)

    expect(myYoox.get('user/personalData')).toStrictEqual({ name: 'Yooni the Goat', age: '25' })
  })

  it('Should set user and be accessible through state key', async () => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

    myYoox.set('user/personalData', { name: 'Gabriel Rizzo', age: '25' })

    expect(myYoox.state.user).toStrictEqual({ name: 'Gabriel Rizzo', age: '25' })
  })

  it('Should set inital value cache', async () => {
    const myYoox = await Yoox.store(storeWithModule, { persist: true })

    myYoox.set('user/personalData', { name: '' , age: '' })

    const persistedValue = await Persist.get()

    console.log('Persisted Value', persistedValue)
    expect(persistedValue).toStrictEqual({ user: { name: '', age: '' } })
  })
})

describe('Testing Yoox with root accessors',() => {
  it('Should create yoox object', async () => {
    const myYoox = await Yoox.store(rootAccessors, { persist: true })

    expect(myYoox.get('userPersonalData')).toStrictEqual({ name: '', age: '' })
  })

  it('Should set user data to store', async () => {
    const myYoox = await Yoox.store(rootAccessors, { persist: true })

    myYoox.set('userPersonalData', { name: 'Gabriel Rizzo', age: '25' })

    expect(myYoox.get('userPersonalData')).toStrictEqual({ name: 'Gabriel Rizzo', age: '25' })
  })
})
