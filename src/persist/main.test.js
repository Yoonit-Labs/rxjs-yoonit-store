import { Persist } from './main.js'
import { delay } from "../test/helpers";
import { NotFoundException } from "./exceptions";

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

    await delay()
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

    await delay()
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

    await delay()
  })

  it('Should return error when there is no cached value', async () => {
    try {
      // setting value to guarantee that store is not empty
      await Persist.set({ value: true })

      // Cleaning persist
      await Persist.clear()

      await Persist.get()

      await delay()
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

    await delay()
  })

  it('Should return false if persist is empty', async () => {
    await Persist.set({ value: true })

    await Persist.clear()

    const cacheClearResult = await Persist.clear()

    expect(cacheClearResult).toBeFalsy()

    await delay()
  })
})
