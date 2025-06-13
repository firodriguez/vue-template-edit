// src/main.js - VERSIÓN OPTIMIZADA
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// ================================
// ESTILOS GLOBALES
// ================================
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
    console.log('🎨 CSS Global optimizado cargado')

    // Hacer servicios accesibles desde consola para debugging
    window.__API_SERVICES__ = apiServices
}

// ================================
// MONTAJE DE LA APP
// ================================

app.mount('#app')

// ================================
// 🔧 HEALTH CHECK ELIMINADO DE MAIN.JS
// ================================
// ❌ ANTES: Se ejecutaba automáticamente al cargar
// apiServices.checkAllServicesHealth().then(health => {
//     console.log('🔍 Estado inicial de servicios:', health)
// }).catch(error => {
//     console.warn('⚠️ Error verificando servicios:', error)
// })

// ✅ AHORA: Solo AppLayout.vue maneja los health checks
// Esto evita llamadas duplicadas y mejora el rendimiento

console.log('✨ App inicializada - Health checks delegados a AppLayout')

// ================================
// DEBUGGING UTILITIES (Solo desarrollo)
// ================================
if (import.meta.env.DEV) {
    // Función helper para verificar servicios manualmente desde consola
    window.checkServices = (force = false) => {
        return apiServices.checkAllServicesHealth(force)
    }

    // Función para ver estado del cache
    window.getCacheStatus = () => {
        return apiServices.getCacheStatus()
    }

    // Función para limpiar cache
    window.clearCache = (serviceName = null) => {
        apiServices.clearHealthCache(serviceName)
        console.log('🗑️ Cache limpiado')
    }

    console.log('🛠️ Debug utilities available:')
    console.log('  - window.checkServices(force?) - Verificar servicios')
    console.log('  - window.getCacheStatus() - Ver estado del cache')
    console.log('  - window.clearCache(service?) - Limpiar cache')
}