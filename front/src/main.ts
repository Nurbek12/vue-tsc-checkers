import { createApp } from 'vue'
import App from './App.vue'
// import VueSocket from 'vue-3-ts-socket.io'

// const io = new VueSocket({
//   debug: true,
//   connection: 'http://localhost:5000'
// })
// import router from './router'
// import { store } from './store'

createApp(App)
    // .use(store)
    // .use(router)
    .mount('#app')
