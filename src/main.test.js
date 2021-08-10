import * as Yoox from './main'
import { rootAccessors, storeWithModule } from "./test/mockedStore";

describe('Testing Yoox modularized', () => {
  it('Should create yoox from object', () => {
    const myYoox = Yoox.store(storeWithModule)

    expect(myYoox.get('user/personalData')).toStrictEqual({ name: '', age: '' })
  })

  it('Should set user name and age', () => {
    const myYoox = Yoox.store(storeWithModule)

    myYoox.set('user/personalData', { name: 'Gabriel Rizzo', age: '25' })

    expect(myYoox.get('user/personalData')).toStrictEqual({ name: 'Gabriel Rizzo', age: '25' })
  })

  it('Should call another setter inside changeName', () => {
    const myYoox = Yoox.store(storeWithModule)

    myYoox.set('user/personalData', { name: 'Gabriel Rizzo', age: '25' })

    myYoox.set('user/changeName', 'Yooni the Goat')

    expect(myYoox.get('user/personalData')).toStrictEqual({ name: 'Yooni the Goat', age: '25' })
  })

  it('Should set user and be accessible through state key', () => {
    const myYoox = Yoox.store(storeWithModule)

    myYoox.set('user/personalData', { name: 'Gabriel Rizzo', age: '25' })

    expect(myYoox.state.user).toStrictEqual({ name: 'Gabriel Rizzo', age: '25' })
  })
})

describe('Testing Yoox with root accessors', () => {
  it('Should create yoox object', () => {
    const myYoox = Yoox.store(rootAccessors)

    expect(myYoox.get('userPersonalData')).toStrictEqual({ name: '', age: '' })
  })

  it('Should set user data to store', () => {
    const myYoox = Yoox.store(rootAccessors)

    myYoox.set('userPersonalData', { name: 'Gabriel Rizzo', age: '25' })

    expect(myYoox.get('userPersonalData')).toStrictEqual({ name: 'Gabriel Rizzo', age: '25' })
  })
})
