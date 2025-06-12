export const APP_CONSTANTS = {
    // Configuración general
    APP_NAME: 'Surfrut Template Editor',
    APP_VERSION: '1.0.0',

    // APIs
    DEFAULT_TIMEOUT: 15000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,

    // DocGen específico
    DOCGEN_TOKEN: import.meta.env.VITE_DOCGEN_TOKEN,
    SUPPORTED_FORMATS: ['pdf', 'html'],
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB

    // UI
    NOTIFICATION_TIMEOUT: 3000,

    // Validaciones
    MIN_TEMPLATE_NAME_LENGTH: 3,
    MAX_TEMPLATE_NAME_LENGTH: 50,
    ALLOWED_FILE_EXTENSIONS: ['.hbs', '.handlebars', '.html']
}

// Exportar PREVIEW_MODES por separado para facilitar importación
export const PREVIEW_MODES = {
    HTML: 'html',
    RENDERED: 'rendered'
}

export const ERROR_MESSAGES = {
    CONNECTION_ERROR: 'Error de conexión con el servidor',
    TEMPLATE_NOT_FOUND: 'Template no encontrado',
    INVALID_DATA: 'Datos inválidos proporcionados',
    GENERATION_FAILED: 'Error al generar el documento',
    TIMEOUT_ERROR: 'Tiempo de espera agotado',
    UNKNOWN_ERROR: 'Ha ocurrido un error inesperado'
}

export const SUCCESS_MESSAGES = {
    TEMPLATE_LOADED: 'Template cargado correctamente',
    PDF_GENERATED: 'PDF generado exitosamente',
    PREVIEW_UPDATED: 'Preview actualizado',
    CONNECTION_SUCCESS: 'Conectado al servidor',
    DATA_SAVED: 'Datos guardados correctamente'
  }