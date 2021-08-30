console.log('[Bundle Loaded] ', window)

/**
 * STORE MODULE USAGE:
 *
 * STATE:
 * $Perse.Store.state.Module.property
 * $Perse.Store.state['Module'].property
 * $Perse.Store.state['Module']['property']
 *
 * GET:
 * $Perse.Store.get('auth/getUser')
 *
 * MIX:
 * $Perse.Store.mix('auth/mixUser')
 *
 * SET:
 * $Perse.Store.set('module/method', payload)
 * $Perse.Store.dispatch({ type: 'module/method', payload: 'payload' })
 */

// COUNT MODULE
// document.getElementById('increment').addEventListener('click', async () => {
//     await $Perse.Store.set('count/increment')
//     console.log('[get: count/getCount] ', $Perse.Store.get('count/getCount'))
// })
// document.getElementById('decrement').addEventListener('click', async () => {
//     await $Perse.Store.set('count/decrement')
//     console.log('[get: count/getCount] ', $Perse.Store.get('count/getCount'))
// })

document.getElementById('faceDetection').addEventListener('click', async () => {
})

document.getElementById('faceCompare').addEventListener('click', async () => {
})

// MAIN MODU
////
// Debug store observe
// - On store change this event listener will trigger
////
// $Perse.Store.observe(async (state) => {
//     console.log('[observe] ', state)
//
//     moduleCount.textContent = JSON.stringify(await $Perse.Store.get('count/getCount'), null, 2);
// })
