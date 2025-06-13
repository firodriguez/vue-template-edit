// src/services/api/index.js - VERSIÓN OPTIMIZADA CON CACHE
import DocGenService from './docgen.service.js'
import BaseApiService from './base.service.js'
import { APP_CONSTANTS } from '../utils/constants.js';

// ================================
// SISTEMA DE CACHE PARA HEALTH CHECKS
// ================================
class HealthCheckManager {
    constructor() {
        this.cache = new Map()
        this.pendingChecks = new Map()
        this.CACHE_DURATION = 10 * 1000 // 30 segundos
    }

    /**
     * Verificar health con cache y deduplicación
     */
    async checkHealth(serviceName, healthCheckFn) {
        const cacheKey = serviceName
        const now = Date.now()

        // 1. Verificar cache válido
        const cached = this.cache.get(cacheKey)
        if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
            console.log(`🔄 [HealthManager] Cache hit para ${serviceName}:`, cached.data)
            return cached.data
        }

        // 2. Verificar si ya hay una llamada en curso para evitar duplicados
        if (this.pendingChecks.has(cacheKey)) {
            console.log(`⏳ [HealthManager] Esperando check en curso para ${serviceName}`)
            return await this.pendingChecks.get(cacheKey)
        }

        // 3. Ejecutar nuevo health check
        console.log(`🔍 [HealthManager] Nuevo health check para ${serviceName}`)

        const checkPromise = this._executeHealthCheck(serviceName, healthCheckFn, now)
        this.pendingChecks.set(cacheKey, checkPromise)

        try {
            const result = await checkPromise
            return result
        } finally {
            this.pendingChecks.delete(cacheKey)
        }
    }

    async _executeHealthCheck(serviceName, healthCheckFn, timestamp) {
        try {
            const result = await healthCheckFn()

            // Guardar en cache
            this.cache.set(serviceName, {
                data: result,
                timestamp
            })

            console.log(`✅ [HealthManager] ${serviceName} verificado:`, result)
            return result

        } catch (error) {
            const errorResult = {
                status: 'error',
                service: serviceName,
                error: error.message || 'Error desconocido'
            }

            // También cachear errores por un tiempo menor
            this.cache.set(serviceName, {
                data: errorResult,
                timestamp: timestamp - (this.CACHE_DURATION * 0.7) // Cache errores por menos tiempo
            })

            console.error(`❌ [HealthManager] Error en ${serviceName}:`, error)
            return errorResult
        }
    }

    /**
     * Limpiar cache manualmente
     */
    clearCache(serviceName = null) {
        if (serviceName) {
            this.cache.delete(serviceName)
            console.log(`🗑️ [HealthManager] Cache limpiado para ${serviceName}`)
        } else {
            this.cache.clear()
            console.log(`🗑️ [HealthManager] Todo el cache limpiado`)
        }
    }

    /**
     * Obtener estado del cache (para debugging)
     */
    getCacheStatus() {
        const status = {}
        for (const [key, value] of this.cache.entries()) {
            const age = Date.now() - value.timestamp
            status[key] = {
                age: `${Math.round(age / 1000)}s`,
                valid: age < this.CACHE_DURATION,
                status: value.data.status
            }
        }
        return status
    }
}

// Instancia global del manager
const healthManager = new HealthCheckManager()

// ================================
// INSTANCIAS DE SERVICIOS
// ================================

// DocGen Service - tu API principal
export const docGenService = new DocGenService()

// ================================
// FACTORY PARA CREAR NUEVOS SERVICIOS
// ================================

/**
 * Crear un nuevo servicio API
 * @param {string} name - Nombre del servicio
 * @param {string} baseURL - URL base del API
 * @param {Object} config - Configuración adicional
 * @returns {BaseApiService} Nueva instancia del servicio
 */
export const createApiService = (name, baseURL, config = {}) => {
    return new BaseApiService(baseURL, {
        ...config,
        headers: {
            'X-Service': name,
            'X-Client': 'vue-template-editor',
            ...config.headers
        }
    })
}

// ================================
// CONFIGURACIÓN DE APIS
// ================================

export const API_CONFIG = {
    DOCGEN: {
        name: 'docgen-service',
        baseURL: 'https://generate.surfrut.com',
        timeout: 3,
        defaultToken: APP_CONSTANTS.DOCGEN_TOKEN
    }
    // Aquí puedes agregar más APIs fácilmente
}

// ================================
// HEALTH CHECK OPTIMIZADO CON CACHE
// ================================

/**
 * Verificar estado de todos los servicios CON CACHE
 * @param {boolean} forceRefresh - Forzar verificación saltando cache
 * @returns {Promise<Object>} Estado de cada servicio
 */
export const checkAllServicesHealth = async (forceRefresh = false) => {
    console.log(`🏥 [API] Verificando servicios (forceRefresh: ${forceRefresh})`)

    // Limpiar cache si se fuerza refresh
    if (forceRefresh) {
        healthManager.clearCache()
    }

    const services = {
        docgen: docGenService
    }

    const healthStatus = {}

    // Verificar servicios usando el manager con cache
    const healthPromises = Object.entries(services).map(async ([name, service]) => {
        const result = await healthManager.checkHealth(name, () => service.healthCheck())
        healthStatus[name] = result
    })

    await Promise.all(healthPromises)

    // Log de resumen
    console.log(`🏥 [API] Resumen de servicios:`,
        Object.entries(healthStatus).map(([name, status]) =>
            `${name}: ${status.status}`
        ).join(', ')
    )

    return healthStatus
}

/**
 * Verificar UN servicio específico
 * @param {string} serviceName - Nombre del servicio ('docgen', etc.)
 * @param {boolean} forceRefresh - Forzar verificación
 * @returns {Promise<Object>} Estado del servicio
 */
export const checkServiceHealth = async (serviceName, forceRefresh = false) => {
    const services = {
        docgen: docGenService
    }

    if (!services[serviceName]) {
        throw new Error(`Servicio '${serviceName}' no encontrado`)
    }

    if (forceRefresh) {
        healthManager.clearCache(serviceName)
    }

    return await healthManager.checkHealth(serviceName, () => services[serviceName].healthCheck())
}

// ================================
// UTILIDADES DE DEBUGGING
// ================================

/**
 * Obtener estado del sistema de cache
 */
export const getCacheStatus = () => {
    return healthManager.getCacheStatus()
}

/**
 * Limpiar cache manualmente
 */
export const clearHealthCache = (serviceName = null) => {
    healthManager.clearCache(serviceName)
}

// ================================
// EXPORTACIÓN POR DEFECTO
// ================================

export default {
    // Servicios activos
    docgen: docGenService,

    // Utilidades principales
    createApiService,
    checkAllServicesHealth,
    checkServiceHealth,

    // Utilidades de cache
    getCacheStatus,
    clearHealthCache,

    // Configuración
    config: API_CONFIG,

    // Health Manager (para casos avanzados)
    healthManager
}