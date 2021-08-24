# Yoox

## How to run the project
``
npm install
npm run serve
``

## How to build and use it on another project
After installing the project:

1- At the root of Perse store directory, run: `npm link`

2- In the project that you want to use Perse store, run: `npm link @cyberlabsai/yoox`

3- Then, run `npm run watch` on Perse directory

## How to use
```
import yourStore from './yourstore'

Yoox.store(yourStore, { persist: true })
```

## store Object
It's only needed to create an object with keys: set, get, mix and state.
<br>

Ie: 
```
{
   state:{
      user:{
         name:'',
         age:''
      }
   },
   set:{
      'userPersonalData':function ({
         mix
      },
      user){
         mix('userPersonalData',
         user)
      }
   },
   get:{
      'userPersonalData':function ({
         state
      }){
         return state.user
      }
   },
   mix:{
      'userPersonalData':function (state,
      {
         payload
      }){
         state.user = payload

      return state
      }
   }
}
```

Or if you wish, you can use as a modularized store as:

```
{
   office:{
      state:{
         name:''
      },
      set:{
         'officeData':function ({
            mix
         },
         user){
            mix('office/officeData',
            user)
         }
      },
      get:{
         'data':function ({
            state
         }){
            return state
         }
      },
      mix:{
         'officeData':function (state,
         {
            payload
         }){
            state.office.name = payload.name

        return state
         }
      }
   },
   user:{
      state:{
         name:'',
         age:''
      },
      set:{
         'personalData':function ({
            mix
         },
         user){
            mix('user/personalData',
            user)
         },
         'changeName':function ({
            set,
            get
         },
         userName){
            const user ={
               ...get('user/personalData')
            }user.name = userName
        set('user/personalData',
            user)
         }
      },
      get:{
         'personalData':function ({
            state
         }){
            return state
         }
      },
      mix:{
         'personalData':function (state,
         {
            payload
         }){
            state.user.name = payload.name
        state.user.age = payload.age

        return state
         }
      }
   }
```

When modularized, all methods will have the module prefix.
Ie: PerseService.get('user/personalData')

## Exported Methods

- set('module/setterName') => ({ mix, set, get}, payload): Method that can be async. You should place your logic here, like http calls.

- get('module/getterName') => ({ store, rootStore }): Retrieve data from store state. `store` key returns data from module, and if there is no module
returns all data. `rootStore` returns all data from store, only available when store is modularized.

- mix('module/mixerName') => (state, payload): Mutate store data. Returns all data from store, where you can mutate it (it's the impure store part).
It's ESSENTIAL to return data, to not break store.


## Persist Param

- If you need some persist data, to improve app performance or to another objective.
It's only necessary to pass { persist: true } to the second parameter on store, and it works like a charm.
  
- Persisted data is always returned on getters, when store is reinitialized.

- When there is a change on store modules, persisted data is reseted, to not cause trouble with wrong store structure.

