import PouchDB from 'pouchdb'
import { catchError, ConflictException } from "../exceptions";

function localDatabase () {
  const db = new PouchDB('state', { revs_limit: 1 })
  const id = 'global_state'

  return {
    /**
     * @method get
     * @description Proxy PouchDB get to abstract lib implementation details. Get persisted value
     * @returns {Promise<Pick<*, never>>}
     */
    get: async function () {
      try {
        const { _id, _rev, ...globalState } = await db.get(id)

        return Promise.resolve(globalState)
      } catch (e) {
        throw catchError(e)
      }
    },
    /**
     * @method update
     * @description Proxy PouchDB update to abstract lib implementation details. Update persisted value
     * @param {any} payload
     * @returns {Promise<*>}
     */
    update: async function (payload) {
      try {
        const cachedData = await db.get(id)

        // Force true ignores _rev
        const dbResponse = await db.put({
          _id: cachedData._id,
          _rev: cachedData._rev,
          ...payload
        }, { force: true })

        return Promise.resolve(dbResponse)
      } catch (e) {
        throw catchError(e)
      }
    },
    /**
     * @description Proxy PouchDB create to abstract lib implementation details. Create registry on persist database
     * @param {any} payload
     * @returns {Promise<*>}
     */
    create: async function (payload) {
      try {
        const dbResponse = await db.put({
          _id: id,
          ...payload
        })

        return Promise.resolve(dbResponse)
      } catch (e) {
        throw catchError(e)
      }
    },
    /**
     * @method remove
     * @description Proxy PouchDB remove to abstract lib implementation details. Remove stored data.
     * @returns {Promise<*>}
     */
    remove: async function () {
      try {
        const cachedData = await db.allDocs()

        await Promise.all(cachedData.rows.map((doc) => {
          console.log(doc)
          return db.remove(doc.id, doc.value.rev)
        }))

        return Promise.resolve(true)
      } catch (e) {
        throw catchError(e)
      }
    }
  }
}

export { localDatabase }
