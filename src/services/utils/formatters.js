// src/services/utils/formatters.js
/**
 * Formatear tamaño de archivo
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} Tamaño formateado
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Formatear fecha
 * @param {string|Date} dateString - Fecha a formatear
 * @param {string} locale - Idioma (default: 'es-ES')
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString, locale = 'es-ES') => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    })
}

/**
 * Formatear tiempo de respuesta
 * @param {number} ms - Milisegundos
 * @returns {string} Tiempo formateado
 */
export const formatResponseTime = (ms) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
}

/**
 * Capitalizar primera letra
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }