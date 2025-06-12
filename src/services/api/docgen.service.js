// src/services/api/docgen.service.js
import BaseApiService from './base.service.js'

class DocGenService extends BaseApiService {
    constructor() {
        // 🔧 Usar URL relativa para aprovechar el proxy de Vite
        // En desarrollo: '' (usa proxy)
        // En producción: 'https://generate.surfrut.com'
        const baseURL = import.meta.env.DEV ? '' : 'https://generate.surfrut.com'

        super(baseURL, {
            headers: {
                'X-Service': 'docgen-service',
                'X-Client': 'vue-template-editor'
            }
        })

        // Configuración por defecto para todas las peticiones
        this.defaultConfig = { token: '1434' }
    }

    // ================================
    // GESTIÓN DE TEMPLATES
    // ================================

    /**
     * Obtener lista de templates disponibles
     * @returns {Promise<Object>} Lista de templates
     */
    async getTemplates() {
        return await this.post('/api/templates', {
            config: this.defaultConfig
        })
    }

    /**
     * Obtener detalles de un template específico
     * @param {string} templateName - Nombre del template
     * @returns {Promise<Object>} Detalles del template
     */
    async getTemplateDetails(templateName) {
        if (!templateName) {
            throw new Error('templateName es requerido')
        }

        return await this.post(`/api/templates/${templateName}`, {
            config: this.defaultConfig
        })
    }

    /**
     * Obtener preview de un template con datos de ejemplo
     * @param {string} templateName - Nombre del template
     * @returns {Promise<string>} HTML del preview
     */
    async getTemplatePreview(templateName) {
        if (!templateName) {
            throw new Error('templateName es requerido')
        }

        const response = await this.post(`/api/templates/${templateName}/preview`, {
            config: this.defaultConfig
        })

        // La respuesta puede ser directamente el HTML o un objeto con data
        return typeof response === 'string' ? response : response.data
    }

    // ================================
    // GENERACIÓN DE PDF
    // ================================

    /**
     * Generar PDF con datos personalizados
     * @param {string} templateName - Nombre del template
     * @param {Object} data - Datos para reemplazar variables
     * @returns {Promise<Blob>} PDF como blob
     */
    async generatePDF(templateName, data = {}) {
        if (!templateName) {
            throw new Error('templateName es requerido')
        }

        const payload = {
            ...data,
            config: this.defaultConfig
        }

        // Para PDF necesitamos responseType blob
        const response = await this.api.post(`/api/pdf/view?template=${templateName}`, payload, {
            responseType: 'blob'
        })

        return response.data
    }

    /**
     * Generar PDF con datos de ejemplo del template
     * @param {string} templateName - Nombre del template
     * @returns {Promise<Blob>} PDF como blob
     */
    async generateExamplePDF(templateName) {
        // Primero obtenemos los datos de ejemplo
        const templateDetails = await this.getTemplateDetails(templateName)

        if (!templateDetails.success || !templateDetails.template.sampleData) {
            throw new Error('Template no tiene datos de ejemplo disponibles')
        }

        return await this.generatePDF(templateName, templateDetails.template.sampleData)
    }

    // ================================
    // HEALTH CHECK PERSONALIZADO
    // ================================

    /**
     * Health check específico para DocGen
     * @returns {Promise<Object>} Estado del servicio
     */
    async healthCheck() {
        try {
            const startTime = Date.now()

            // Usar endpoint específico o fallback
            const endpoint = '/api/health'
            await this.get(endpoint)

            const responseTime = Date.now() - startTime

            return {
                status: 'online',
                service: 'DocGen Service',
                responseTime: `${responseTime}ms`,
                endpoint: this.api.defaults.baseURL + endpoint
            }
        } catch (error) {
            return {
                status: 'offline',
                service: 'DocGen Service',
                error: error.friendlyMessage || error.message,
                endpoint: this.api.defaults.baseURL + '/api/health'
            }
        }
    }

    // ================================
    // UTILIDADES DE TEMPLATE (sin cambios)
    // ================================

    /**
     * Procesar contenido del template y extraer variables
     * @param {string} templateContent - Contenido del template
     * @returns {Object} Variables extraídas organizadas
     */
    extractTemplateVariables(templateContent) {
        const result = {
            normalVariables: [],
            loops: [],
            arrayInfo: []
        }

        if (!templateContent) {
            return result
        }

        // 1. Detectar arrays {{#each NOMBRE}}
        const arrayRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g
        const arraysFound = new Set()
        const variablesInArrays = new Set()

        let arrayMatch
        while ((arrayMatch = arrayRegex.exec(templateContent)) !== null) {
            const arrayName = arrayMatch[1]
            const arrayContent = arrayMatch[2]

            arraysFound.add(arrayName)

            // Extraer variables dentro del array
            const arrayVariables = arrayContent.match(/\{\{([^}#\/]+)\}\}/g) || []
            const cleanArrayVars = arrayVariables
                .map(v => v.replace(/[{}]/g, '').trim())
                .filter(v => !v.startsWith('#') && !v.startsWith('/') && v !== 'else')

            cleanArrayVars.forEach(variable => variablesInArrays.add(variable))

            result.arrayInfo.push({
                name: arrayName,
                variables: cleanArrayVars
            })
        }

        // 2. Extraer todas las variables del template
        const allVariableMatches = templateContent.match(/\{\{([^}#\/]+)\}\}/g) || []
        const allVariables = allVariableMatches.map(match => match.replace(/[{}]/g, '').trim())

        // 3. Filtrar variables normales (excluir las de arrays)
        result.normalVariables = [...new Set(allVariables.filter(variable => {
            return !variable.startsWith('#') &&
                !variable.startsWith('/') &&
                !variable.includes('this') &&
                variable !== 'else' &&
                !variablesInArrays.has(variable)
        }))]

        result.loops = Array.from(arraysFound).map(arrayName => `each ${arrayName}`)

        return result
    }

    /**
     * Compilar template con datos proporcionados
     * @param {string} template - Template HTML
     * @param {Object} data - Datos para compilar
     * @param {Object} arrayInfo - Información de arrays
     * @returns {string} HTML compilado
     */
    compileTemplate(template, data, arrayInfo = []) {
        let html = template

        // 1. Reemplazar variables simples
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'string' || typeof data[key] === 'number') {
                const regex = new RegExp(`{{${key}}}`, 'g')
                html = html.replace(regex, data[key] || '')
            }
        })

        // 2. Manejar arrays
        arrayInfo.forEach(arrayData => {
            const arrayName = arrayData.name
            const arrayValues = data[arrayName]

            if (arrayValues && Array.isArray(arrayValues) && arrayValues.length > 0) {
                const arrayRegex = new RegExp(`{{#each\\s+${arrayName}}}([\\s\\S]*?){{/each}}`, 'g')
                const match = arrayRegex.exec(html)

                if (match) {
                    const arrayTemplate = match[1]
                    let arrayRows = ''

                    arrayValues.forEach(item => {
                        let itemRow = arrayTemplate
                        Object.keys(item).forEach(key => {
                            const regex = new RegExp(`{{${key}}}`, 'g')
                            itemRow = itemRow.replace(regex, item[key] || '')
                        })
                        arrayRows += itemRow
                    })

                    html = html.replace(match[0], arrayRows)
                }
            } else {
                // Remover loop vacío
                const arrayRegex = new RegExp(`{{#each\\s+${arrayName}}}[\\s\\S]*?{{/each}}`, 'g')
                html = html.replace(arrayRegex, '')
            }
        })

        // 3. Variables no definidas
        html = html.replace(/{{[^}]+}}/g,
            '<span style="color: red; background: yellow; padding: 2px;">[Variable no definida]</span>'
        )

        return html
    }

    // ================================
    // VALIDACIONES
    // ================================

    /**
     * Validar si un template existe
     * @param {string} templateName - Nombre del template
     * @returns {Promise<boolean>} True si existe
     */
    async templateExists(templateName) {
        try {
            const response = await this.getTemplateDetails(templateName)
            return response.success === true
        } catch (error) {
            return false
        }
    }

    /**
     * Validar datos antes de generar PDF
     * @param {Object} data - Datos a validar
     * @param {Array} requiredFields - Campos requeridos
     * @returns {Object} Resultado de validación
     */
    validateTemplateData(data, requiredFields = []) {
        const validation = {
            isValid: true,
            errors: [],
            warnings: []
        }

        // Verificar campos requeridos
        requiredFields.forEach(field => {
            if (!data[field] || data[field] === '') {
                validation.errors.push(`Campo requerido: ${field}`)
                validation.isValid = false
            }
        })

        // Verificar arrays vacíos
        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key]) && data[key].length === 0) {
                validation.warnings.push(`Array vacío: ${key}`)
            }
        })

        return validation
    }
}

export default DocGenService