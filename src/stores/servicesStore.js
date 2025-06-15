// src/stores/servicesStore.js - ESTADO GLOBAL REACTIVO
import { reactive, readonly } from 'vue'
import { checkAllServicesHealth, checkServiceHealth } from '@/services/api/index.js'

// ================================
// ESTADO REACTIVO GLOBAL
// ================================
const state = reactive({
    services: {
        docgen: 'unknown'
    },
    loading: false,
    lastCheckTime: 0,
    error: null
})

// ================================
// ACCIONES (MUTATIONS)
// ================================
const actions = {
    // Actualizar estado de un servicio específico
    updateServiceStatus(serviceName, status) {
        console.log(`🔄 [ServicesStore] Actualizando ${serviceName}: ${state.services[serviceName]} → ${status}`)
        state.services[serviceName] = status
        state.lastCheckTime = Date.now()
    },

    // Actualizar todos los servicios
    updateAllServices(servicesData) {
        console.log('🔄 [ServicesStore] Actualizando todos los servicios:', servicesData)

        Object.entries(servicesData).forEach(([serviceName, healthData]) => {
            const status = healthData?.status || 'offline'
            state.services[serviceName] = status
        })

        state.lastCheckTime = Date.now()
        state.error = null
    },

    // Establecer estado de carga
    setLoading(loading) {
        state.loading = loading
    },

    // Establecer error
    setError(error) {
        state.error = error
        console.error('❌ [ServicesStore] Error:', error)
    },

    // Limpiar error
    clearError() {
        state.error = null
    }
}

// ================================
// MÉTODOS PRINCIPALES
// ================================

/**
 * Verificar todos los servicios y actualizar el estado global
 */
async function checkAllServices(forceRefresh = false) {
    if (state.loading) {
        console.log('🔧 [ServicesStore] Verificación ya en curso, saltando...')
        return state.services
    }

    actions.setLoading(true)
    actions.clearError()

    try {
        console.log(`🏥 [ServicesStore] Verificando servicios (force: ${forceRefresh})`)

        const healthData = await checkAllServicesHealth(forceRefresh)
        actions.updateAllServices(healthData)

        console.log('✅ [ServicesStore] Servicios actualizados:', state.services)
        return state.services

    } catch (error) {
        actions.setError(error.message || 'Error verificando servicios')

        // En caso de error, marcar servicios como error
        Object.keys(state.services).forEach(serviceName => {
            actions.updateServiceStatus(serviceName, 'error')
        })

        throw error
    } finally {
        actions.setLoading(false)
    }
}

/**
 * Verificar un servicio específico
 */
async function checkSingleService(serviceName, forceRefresh = false) {
    try {
        console.log(`🏥 [ServicesStore] Verificando ${serviceName}`)

        const healthData = await checkServiceHealth(serviceName, forceRefresh)
        actions.updateServiceStatus(serviceName, healthData.status || 'offline')

        return healthData
    } catch (error) {
        actions.updateServiceStatus(serviceName, 'error')
        throw error
    }
}

// ================================
// GETTERS (COMPUTED)
// ================================
const getters = {
    // Estado de un servicio específico
    getServiceStatus: (serviceName) => state.services[serviceName] || 'unknown',

    // Todos los servicios
    getAllServices: () => ({ ...state.services }),

    // Estado de carga
    isLoading: () => state.loading,

    // Último tiempo de verificación
    getLastCheckTime: () => state.lastCheckTime,

    // Error actual
    getError: () => state.error,

    // Verificar si hay servicios offline
    hasOfflineServices: () => Object.values(state.services).some(status =>
        status === 'offline' || status === 'error'
    ),

    // Conteo de servicios por estado
    getServicesSummary: () => {
        const summary = { online: 0, offline: 0, error: 0, unknown: 0 }
        Object.values(state.services).forEach(status => {
            summary[status] = (summary[status] || 0) + 1
        })
        return summary
    }
}

// ================================
// COMPOSABLE PARA USO EN COMPONENTES
// ================================
export function useServicesStore() {
    return {
        // Estado reactivo (readonly para evitar mutaciones directas)
        state: readonly(state),

        // Getters
        ...getters,

        // Acciones principales
        checkAllServices,
        checkSingleService,

        // Acciones de estado (para casos especiales)
        updateServiceStatus: actions.updateServiceStatus,
        setLoading: actions.setLoading,
        clearError: actions.clearError
    }
}

// ================================
// EXPORTACIÓN CLÁSICA (COMPATIBLE)
// ================================
export default {
    state: readonly(state),
    checkAllServices,
    checkSingleService,
    updateServiceStatus: actions.updateServiceStatus,
    getServiceStatus: getters.getServiceStatus,
    getAllServices: getters.getAllServices,
    isLoading: getters.isLoading
}