# perse-store

## How to run the project
``
npm install
npm run serve
``

## How to build and use it on another project
After installing the project:

1- At the root of Perse store directory, run: `npm link`

2- In the project that you want to use Perse store, run: `npm link @cyberlabsai/perse-store`

3- Then, run `npm run watch` on Perse directory

## How to use
```
import yourStore from './yourstore'

Yoox.store(yourStore)
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

