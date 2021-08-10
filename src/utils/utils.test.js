import { modularizeFunctionNames, createStoreAccessors } from '.'
import { storeWithModule, rootAccessors } from '../test/mockedStore'
import {areAccessorsKeysEquals, areArraysEquals} from "../test/helpers";

describe('Testing function modularizeFunctionNames', () => {
  it('Should return object with modularized function names', () => {
    const moduleName = 'customer'

    const fnObject = {
      'create': () => ({}),
      'delete': () => ({}),
      'get': () => ({}),
      'update': () => ({}),
    }

    const modularizedFunctions = modularizeFunctionNames(fnObject, moduleName)

    expect(Object.keys(modularizedFunctions).every(functionName => functionName.split('/')[0] === moduleName))
      .toBeTruthy()
  })
})

describe('Testing function createStoreAccessors', () => {
  it('Should create store accessors correctly, with module', () => {
    const accessors = createStoreAccessors(storeWithModule)
    const expectedAccessors = {
      actionList: [
        'user/personalData',
        'user/changeName'
      ],
      getterList: [
        'user/personalData'
      ],
      setterList: [
        'user/personalData'
      ],
      initialState: [
        'user'
      ]
    }

    expect(areAccessorsKeysEquals(expectedAccessors, accessors)).toBeTruthy()
  })

  it('Should create store accessors from root', () => {
    const accessors = createStoreAccessors(rootAccessors)

    const expectedAccessors = {
      actionList: [
        'userPersonalData',
      ],
      getterList: [
        'userPersonalData'
      ],
      setterList: [
        'userPersonalData'
      ],
      initialState: [
        'user'
      ]
    }

    expect(areAccessorsKeysEquals(expectedAccessors, accessors)).toBeTruthy()
  })
})
