import DocGenService from './docgen.service.js'
import BaseApiService from './base.service.js'

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
        timeout: 15000,
        defaultToken: '1434'
    },
    // Aquí puedes agregar más APIs fácilmente:
    // ANALYTICS: {
    //   name: 'analytics-service',
    //   baseURL: 'https://analytics.surfrut.com',
    //   timeout: 10000
    // },
    // USERS: {
    //   name: 'users-service', 
    //   baseURL: 'https://users.surfrut.com',
    //   timeout: 8000
    // }
}

// ================================
// HEALTH CHECK DE TODOS LOS SERVICIOS
// ================================

/**
 * Verificar estado de todos los servicios
 * @returns {Promise<Object>} Estado de cada servicio
 */
export const checkAllServicesHealth = async () => {
    const services = { docgen: docGenService }
    const healthStatus = {}

    const healthPromises = Object.entries(services).map(async ([name, service]) => {
        try {
            const health = await service.healthCheck()
            healthStatus[name] = health
        } catch (error) {
            healthStatus[name] = {
                status: 'error',
                service: service.api?.defaults?.baseURL || 'unknown',
                error: error.message
            }
        }
    })

    await Promise.all(healthPromises)
    return healthStatus
}

// ================================
// EXPORTACIÓN POR DEFECTO
// ================================

export default {
    // Servicios activos
    docgen: docGenService,

    // Utilidades
    createApiService,
    checkAllServicesHealth,

    // Configuración
    config: API_CONFIG
}