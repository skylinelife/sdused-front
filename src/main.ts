import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'

const pinia =createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Antd)

app.mount('#app')
