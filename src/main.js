// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// ================================
// ESTILOS GLOBALES
// ================================
// ✅ AGREGAR ESTA LÍNEA - CSS Global Optimizado
import './assets/styles/global-optimization.css'

// ================================
// IMPORTAR SERVICIOS
// ================================
import apiServices from './services/api/index.js'

const app = createApp(App)

// ================================
// CONFIGURACIÓN GLOBAL DE SERVICIOS
// ================================

// Hacer los servicios disponibles globalmente
app.config.globalProperties.$api = apiServices

// También podemos inyectarlos individualmente si preferimos
app.config.globalProperties.$docGenService = apiServices.docgen

// ================================
// PLUGINS Y CONFIGURACIÓN
// ================================

app.use(router)
app.use(vuetify)

// ================================
// CONFIGURACIÓN DE DESARROLLO
// ================================

if (import.meta.env.DEV) {
    // Logs adicionales en desarrollo
    console.log('🚀 App iniciada en modo desarrollo')
    console.log('📡 Servicios disponibles:', Object.keys(apiServices))
    console.log('🎨 CSS Global optimizado cargado') // ✅ Log adicional

    // Hacer servicios accesibles desde consola para debugging
    window.__API_SERVICES__ = apiServices
}

// ================================
// MONTAJE DE LA APP
// ================================

app.mount('#app')

// ================================
// HEALTH CHECK INICIAL
// ================================

// Verificar estado de servicios al iniciar (opcional)
apiServices.checkAllServicesHealth().then(health => {
    console.log('🔍 Estado inicial de servicios:', health)
}).catch(error => {
    console.warn('⚠️ Error verificando servicios:', error)
})