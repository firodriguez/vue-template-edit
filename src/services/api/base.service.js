// src/services/api/base.service.js
import axios from 'axios'

class BaseApiService {
    constructor(baseURL, config = {}) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers
            },
            timeout: config.timeout || 15000,
            ...config
        })

        // Configurar interceptores
        this.setupInterceptors()
    }

    setupInterceptors() {
        // Request interceptor - para logs y configuración
        this.api.interceptors.request.use(
            (config) => {
                console.log(`🚀 [${this.constructor.name}] ${config.method?.toUpperCase()} ${config.url}`)
                return config
            },
            (error) => {
                console.error('❌ Request Error:', error)
                return Promise.reject(error)
            }
        )

        // Response interceptor - para manejo de errores
        this.api.interceptors.response.use(
            (response) => {
                console.log(`✅ [${this.constructor.name}] ${response.status} ${response.config.url}`)
                return response
            },
            (error) => {
                const friendlyError = this.handleError(error)
                console.error('❌ Response Error:', friendlyError)
                return Promise.reject(friendlyError)
            }
        )
    }

    handleError(error) {
        const errorInfo = {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            service: this.constructor.name
        }

        // Mensajes amigables según el tipo de error
        switch (error.response?.status) {
            case 404:
                errorInfo.friendlyMessage = 'Recurso no encontrado'
                break
            case 500:
                errorInfo.friendlyMessage = 'Error interno del servidor'
                break
            case 403:
                errorInfo.friendlyMessage = 'Sin permisos para acceder'
                break
            case 401:
                errorInfo.friendlyMessage = 'No autorizado'
                break
            default:
                if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
                    errorInfo.friendlyMessage = 'Error de conexión con el servidor'
                } else {
                    errorInfo.friendlyMessage = 'Ha ocurrido un error inesperado'
                }
        }

        return errorInfo
    }

    // Métodos HTTP base
    async get(url, config = {}) {
        const response = await this.api.get(url, config)
        return response.data
    }

    async post(url, data = {}, config = {}) {
        const response = await this.api.post(url, data, config)
        return response.data
    }

    async put(url, data = {}, config = {}) {
        const response = await this.api.put(url, data, config)
        return response.data
    }

    async delete(url, config = {}) {
        const response = await this.api.delete(url, config)
        return response.data
    }

    // Health check genérico
    async healthCheck(endpoint = '/health') {
        try {
            const startTime = Date.now()
            await this.get(endpoint)
            const responseTime = Date.now() - startTime

            return {
                status: 'online',
                service: this.api.defaults.baseURL,
                responseTime: `${responseTime}ms`
            }
        } catch (error) {
            return {
                status: 'offline',
                service: this.api.defaults.baseURL,
                error: error.friendlyMessage || error.message
            }
        }
    }
}

export default BaseApiService