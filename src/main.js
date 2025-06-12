// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'

// Configuración global de axios
axios.defaults.baseURL = 'https://generate.surfrut.com'
axios.defaults.headers.common['Content-Type'] = 'application/json'

const app = createApp(App)

// Hacer axios disponible globalmente
app.config.globalProperties.$http = axios

app.use(router)
app.use(vuetify)

app.mount('#app')