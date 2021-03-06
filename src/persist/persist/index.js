import { localDatabase } from "../db";
import {ConflictException, NotFoundException} from "../exceptions";

function CreatePersistence () {
  const db = localDatabase()

  async function create (payload) {
    try {
      await db.create(payload)
      return Promise.resolve(true)
    } catch (e) {
      if (e instanceof ConflictException) {
        await db.update(payload)

        return Promise.resolve(true)
      }
    }

  }
  return {
    /**
     * @method get
     * @description Retrieve persisted values
     * @returns {Promise<Pick<*, never>|undefined>}
     */
    get: async function () {
      return db.get()
    },

    /**
     * @method set
     * @description Set value to be persisted, if no value has been stored, it creates the payload.
     * @param payload
     * @returns {Promise<boolean>}
     */
    set: async function (payload) {
      try {
        await db.update({ ...payload })

        return Promise.resolve(true)
      } catch (e) {
        if (e instanceof NotFoundException) {
          return create(payload)
        }

        return Promise.reject(e)
      }
    },

    /**
     * @method clear
     * @description Clear persisted value
     * @returns {Promise<boolean>}
     */
    clear: async function () {
      try {
        await db.remove()

        return Promise.resolve(true)
      } catch (e) {
        if (e instanceof NotFoundException) {
          console.warn('Empty Database')
          return Promise.resolve(false)
        }

        return Promise.reject(e)
      }
    }
  }
}

const Persist = CreatePersistence()

export { Persist }
