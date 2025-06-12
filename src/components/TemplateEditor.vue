<!-- src/components/TemplateEditor.vue (Versión de Transición) -->
<template>
    <v-app>
        <!-- TOOLBAR -->
        <v-app-bar color="surfrut" dark elevation="2">
            <v-app-bar-title>
                🚀 Surfrut Template Editor
            </v-app-bar-title>

            <v-spacer></v-spacer>

            <v-tooltip text="Estado de conexión con generate.surfrut.com" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-chip v-bind="props" :color="connectionStatus ? 'success' : 'error'" text-color="white" small>
                        <v-icon left small>
                            {{ connectionStatus ? 'mdi-cloud-check' : 'mdi-cloud-off' }}
                        </v-icon>
                        {{ connectionStatus ? 'PDF Service Online' : 'PDF Service Offline' }}
                    </v-chip>
                </template>
            </v-tooltip>

            <v-btn icon @click="checkConnection" :loading="loadingConnection">
                <v-icon>mdi-refresh</v-icon>
            </v-btn>
        </v-app-bar>

        <!-- CONTENIDO PRINCIPAL -->
        <v-main>
            <v-container fluid class="pa-0" style="height: calc(100vh - 64px);">
                <v-row no-gutters style="height: 100%;">

                    <!-- PANEL IZQUIERDO: Templates y Variables -->
                    <v-col cols="12" md="4" class="panel-left">
                        <v-card height="100%" class="d-flex flex-column">

                            <!-- SELECCIÓN DE TEMPLATE -->
                            <v-card-title class="py-3">
                                <v-icon left color="primary">mdi-file-document</v-icon>
                                Templates Disponibles
                            </v-card-title>

                            <v-card-text class="py-2">
                                <v-select v-model="selectedTemplate" :items="templates" item-title="displayName"
                                    item-value="name" label="Seleccionar template" outlined dense
                                    :loading="loadingTemplates" @update:model-value="loadTemplateDetails">
                                    <template v-slot:item="{ props, item }">
                                        <v-list-item v-bind="props">
                                            <template v-slot:prepend>
                                                <v-icon color="primary">
                                                    {{ item.raw.hasExample ? 'mdi-file-check' : 'mdi-file-outline' }}
                                                </v-icon>
                                            </template>
                                            <v-list-item-title>📄 {{ item.raw.name }}</v-list-item-title>
                                            <v-list-item-subtitle>
                                                📏 {{ item.raw.formattedSize }} •
                                                📅 {{ item.raw.formattedDate }} •
                                                {{ item.raw.hasExample ? '✅ Con datos ejemplo' : '❌ Sin datos ejemplo'
                                                }}
                                            </v-list-item-subtitle>
                                        </v-list-item>
                                    </template>

                                    <template v-slot:selection="{ item }">
                                        <span>{{ item.title }}</span>
                                    </template>
                                </v-select>

                                <v-row no-gutters class="mt-2">
                                    <v-col cols="6" class="pr-1">
                                        <v-btn color="primary" variant="outlined" @click="loadTemplates"
                                            :loading="loadingTemplates" block size="small">
                                            <v-icon left small>mdi-refresh</v-icon>
                                            Actualizar
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="6" class="pl-1">
                                        <v-btn :color="isShowingExample ? 'orange' : 'info'" variant="outlined"
                                            @click="toggleExample" :loading="loadingExample"
                                            :disabled="!selectedTemplate" block size="small">
                                            <v-icon left small>
                                                {{ isShowingExample ? 'mdi-pencil' : 'mdi-eye-outline' }}
                                            </v-icon>
                                            {{ isShowingExample ? 'Volver a Editar' : 'Ver Ejemplo' }}
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-text>

                            <v-divider></v-divider>

                            <!-- VARIABLES DEL TEMPLATE -->
                            <div v-if="templateData" class="flex-grow-1 variables-container">
                                <v-card-title class="py-3">
                                    <v-icon left color="orange">mdi-variable</v-icon>
                                    Variables ({{ templateData.normalVariables?.length || 0 }})
                                </v-card-title>

                                <v-card-text class="variables-scroll-area">
                                    <v-alert v-if="templateData.loops?.length" type="info" variant="tonal" class="mb-4">
                                        <strong>Loops detectados:</strong>
                                        <br>{{ templateData.loops.join(', ') }}
                                    </v-alert>

                                    <!-- FORMULARIO DINÁMICO -->
                                    <div v-for="variable in templateData.normalVariables" :key="variable">
                                        <v-text-field v-model="formData[variable]" :label="variable" outlined dense
                                            class="mb-2" @input="generatePreview" clearable>
                                            <template v-slot:prepend-inner>
                                                <v-icon size="small" color="grey">mdi-code-braces</v-icon>
                                            </template>
                                        </v-text-field>
                                    </div>

                                    <!-- SECCIÓN DINÁMICA PARA ARRAYS -->
                                    <div v-if="hasArrays">
                                        <v-divider class="my-4"></v-divider>

                                        <!-- Por cada array detectado -->
                                        <div v-for="arrayInfo in templateData.arrayInfo" :key="arrayInfo.name"
                                            class="mb-6">
                                            <v-subheader>
                                                <v-icon left>mdi-table</v-icon>
                                                {{ arrayInfo.name }} (Array) - {{ arrayInfo.variables.length }}
                                                variables
                                            </v-subheader>

                                            <v-btn :color="arrayInfo.name === 'productos' ? 'success' : 'primary'"
                                                size="small" @click="addArrayItem(arrayInfo.name, arrayInfo.variables)"
                                                block class="mb-3">
                                                <v-icon left>mdi-plus</v-icon>
                                                Agregar {{ arrayInfo.name }}
                                            </v-btn>

                                            <!-- Items del array -->
                                            <v-card v-for="(item, index) in formData[arrayInfo.name] || []"
                                                :key="`${arrayInfo.name}-${index}`" class="mb-2" variant="outlined">
                                                <v-card-text class="py-2">
                                                    <div class="d-flex justify-space-between align-center mb-2">
                                                        <strong>{{ arrayInfo.name }} {{ index + 1 }}</strong>
                                                        <v-btn icon size="small" color="error"
                                                            @click="removeArrayItem(arrayInfo.name, index)">
                                                            <v-icon>mdi-delete</v-icon>
                                                        </v-btn>
                                                    </div>

                                                    <!-- Campos dinámicos según variables del array -->
                                                    <div v-for="variable in arrayInfo.variables" :key="variable">
                                                        <v-text-field v-model="item[variable]" :label="variable"
                                                            density="compact" @input="generatePreview"></v-text-field>
                                                    </div>
                                                </v-card-text>
                                            </v-card>
                                        </div>
                                    </div>
                                </v-card-text>
                            </div>

                            <!-- BOTONES DE ACCIÓN -->
                            <v-card-actions class="pa-4">
                                <v-btn color="orange" block @click="generatePreview" :loading="loadingPreview"
                                    :disabled="!selectedTemplate || isShowingExample">
                                    <v-icon left>mdi-eye</v-icon>
                                    Actualizar Preview
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>

                    <!-- PANEL DERECHO: Preview -->
                    <v-col cols="12" md="8" class="panel-right">
                        <v-card height="100%" class="d-flex flex-column">

                            <!-- HEADER DEL PREVIEW -->
                            <v-card-title class="py-3 d-flex align-center">
                                <v-icon left color="blue">mdi-eye</v-icon>
                                Preview: {{ selectedTemplate || 'Sin template' }}

                                <v-spacer></v-spacer>

                                <!-- Botón para generar PDF -->
                                <v-btn v-if="shouldShowPDFButton" color="success" size="small" @click="generatePDF"
                                    :loading="loadingPDF" class="mr-2">
                                    <v-icon left small>mdi-file-pdf</v-icon>
                                    {{ isShowingExample ? 'PDF Ejemplo' : 'Generar PDF' }}
                                </v-btn>

                                <v-btn v-if="previewHTML" color="primary" size="small" @click="copyHtmlToClipboard"
                                    class="mr-2">
                                    <v-icon left small>mdi-content-copy</v-icon>
                                    Copiar HTML
                                </v-btn>

                                <v-btn-toggle v-model="previewMode" mandatory>
                                    <v-btn value="html" size="small">
                                        <v-icon>mdi-code-tags</v-icon>
                                        HTML
                                    </v-btn>
                                    <v-btn value="rendered" size="small">
                                        <v-icon>mdi-web</v-icon>
                                        Vista
                                    </v-btn>
                                </v-btn-toggle>
                            </v-card-title>

                            <v-divider></v-divider>

                            <!-- CONTENIDO DEL PREVIEW -->
                            <v-card-text class="flex-grow-1 pa-0" style="overflow: hidden;">

                                <!-- VISTA HTML (Código) -->
                                <div v-if="previewMode === 'html'" class="preview-container html-view">
                                    <v-card class="ma-4" variant="outlined">
                                        <v-card-title class="py-2">
                                            <v-icon left color="orange">mdi-code-tags</v-icon>
                                            Código HTML Generado
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" size="small" @click="copyHtmlToClipboard"
                                                :disabled="!previewHTML">
                                                <v-icon left small>mdi-content-copy</v-icon>
                                                Copiar
                                            </v-btn>
                                        </v-card-title>
                                        <v-card-text>
                                            <pre
                                                class="html-code">{{ previewHTML || 'No hay contenido HTML generado' }}</pre>
                                        </v-card-text>
                                    </v-card>
                                </div>

                                <!-- VISTA RENDERIZADA -->
                                <div v-else class="preview-container rendered-view">
                                    <div v-if="!previewHTML" class="no-preview">
                                        <v-icon size="64" color="grey">mdi-file-document-outline</v-icon>
                                        <p>Genera el preview para ver el resultado</p>
                                    </div>
                                    <div v-else style="position: relative; height: 100%;">
                                        <!-- Marca de agua si es ejemplo -->
                                        <div v-if="isShowingExample" class="watermark">EJEMPLO</div>
                                        <iframe ref="previewFrame" :srcdoc="previewHTML"
                                            style="width: 100%; height: 100%; border: none;"
                                            @load="onPreviewLoad"></iframe>
                                    </div>
                                </div>

                            </v-card-text>
                        </v-card>
                    </v-col>

                </v-row>
            </v-container>
        </v-main>

        <!-- SNACKBAR PARA NOTIFICACIONES -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top">
            {{ snackbar.message }}
            <template v-slot:actions>
                <v-btn variant="text" @click="snackbar.show = false">
                    Cerrar
                </v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
// ================================
// IMPORTACIONES SIMPLIFICADAS
// ================================
import { docGenService } from '@/services/api/index.js'
import { formatFileSize, formatDate } from '@/services/utils/formatters.js'

export default {
    name: 'TemplateEditor',

    data() {
        return {
            // Estado de conexión
            connectionStatus: false,
            loadingConnection: false,

            // Templates
            templates: [],
            selectedTemplate: null,
            templateData: null,
            loadingTemplates: false,
            loadingExample: false,

            // Formulario dinámico
            formData: {},

            // Preview
            previewMode: 'rendered', // Usar string directamente
            previewHTML: '',
            previousPreviewHTML: '',
            loadingPreview: false,
            loadingPDF: false,
            isShowingExample: false,

            // Notificaciones
            snackbar: {
                show: false,
                message: '',
                color: 'success'
            }
        }
    },

    computed: {
        hasArrays() {
            return this.templateData?.arrayInfo?.length > 0
        },

        shouldShowPDFButton() {
            return this.selectedTemplate !== null
        }
    },

    async mounted() {
        await this.initializeComponent()
    },

    methods: {
        // ================================
        // INICIALIZACIÓN
        // ================================
        async initializeComponent() {
            await this.checkConnection()
            if (this.connectionStatus) {
                await this.loadTemplates()
            }
        },

        // ================================
        // CONEXIÓN Y HEALTH CHECK
        // ================================
        async checkConnection() {
            this.loadingConnection = true
            try {
                const health = await docGenService.healthCheck()
                this.connectionStatus = health.status === 'online'

                if (this.connectionStatus) {
                    this.showMessage('Conectado al servidor PDF', 'success')
                } else {
                    this.showMessage('Error de conexión con el servidor', 'error')
                }

            } catch (error) {
                this.connectionStatus = false
                this.showMessage(error.friendlyMessage || 'Error de conexión con el servidor', 'error')
                console.error('Error de conexión:', error)
            } finally {
                this.loadingConnection = false
            }
        },

        // ================================
        // GESTIÓN DE TEMPLATES
        // ================================
        async loadTemplates() {
            this.loadingTemplates = true
            try {
                const response = await docGenService.getTemplates()

                if (response.success) {
                    this.templates = response.templates.map(template => ({
                        ...template,
                        displayName: `📄 ${template.name}`,
                        formattedSize: formatFileSize(template.size),
                        formattedDate: formatDate(template.modified)
                    }))

                    this.showMessage(`${this.templates.length} templates cargados`, 'success')
                }

            } catch (error) {
                this.showMessage(error.friendlyMessage || 'Error cargando templates', 'error')
                console.error('Error cargando templates:', error)
            } finally {
                this.loadingTemplates = false
            }
        },

        async loadTemplateDetails() {
            if (!this.selectedTemplate) return

            try {
                const response = await docGenService.getTemplateDetails(this.selectedTemplate)

                if (response.success) {
                    const template = response.template

                    // Usar el método del servicio para extraer variables
                    const variableInfo = docGenService.extractTemplateVariables(template.content)

                    this.templateData = {
                        ...template,
                        ...variableInfo
                    }

                    console.log('🧠 Template procesado:', this.templateData)

                    this.initializeFormData()
                    await this.generatePreview()
                    this.showMessage(`Template ${this.selectedTemplate} cargado`, 'info')
                }

            } catch (error) {
                this.showMessage(error.friendlyMessage || 'Error cargando template', 'error')
                console.error('Error cargando template:', error)
            }
        },

        // ================================
        // FORMULARIO DINÁMICO
        // ================================
        initializeFormData() {
            this.formData = {}

            // Inicializar arrays detectados
            if (this.templateData?.arrayInfo) {
                this.templateData.arrayInfo.forEach(arrayInfo => {
                    this.formData[arrayInfo.name] = []
                    // Agregar un item por defecto
                    this.addArrayItem(arrayInfo.name, arrayInfo.variables)
                })
            }
        },

        addArrayItem(arrayName, variables) {
            if (!this.formData[arrayName]) {
                this.formData[arrayName] = []
            }

            const newItem = {}
            variables.forEach(variable => {
                newItem[variable] = ''
            })

            this.formData[arrayName].push(newItem)
            this.generatePreview()

            console.log(`➕ Agregado ${arrayName}:`, newItem)
        },

        removeArrayItem(arrayName, index) {
            if (this.formData[arrayName]) {
                this.formData[arrayName].splice(index, 1)
                this.generatePreview()
                console.log(`🗑️ Eliminado ${arrayName} en índice ${index}`)
            }
        },

        // ================================
        // PREVIEW Y PDF
        // ================================
        async generatePreview() {
            if (!this.selectedTemplate || !this.templateData) return

            this.loadingPreview = true
            this.isShowingExample = false

            try {
                // Usar el método del servicio para compilar
                this.previewHTML = docGenService.compileTemplate(
                    this.templateData.content,
                    this.formData,
                    this.templateData.arrayInfo
                )

                this.previousPreviewHTML = this.previewHTML

            } catch (error) {
                this.showMessage(error.friendlyMessage || 'Error generando preview', 'error')
                console.error('Error generando preview:', error)
            } finally {
                this.loadingPreview = false
            }
        },

        async generatePDF() {
            if (!this.selectedTemplate) return

            this.loadingPDF = true
            try {
                let pdfBlob

                if (this.isShowingExample) {
                    // Generar PDF del ejemplo
                    pdfBlob = await docGenService.generateExamplePDF(this.selectedTemplate)
                } else {
                    // Validar datos antes de generar
                    const validation = docGenService.validateTemplateData(this.formData)

                    if (!validation.isValid) {
                        this.showMessage(`Errores: ${validation.errors.join(', ')}`, 'error')
                        return
                    }

                    // Generar PDF con datos del formulario
                    pdfBlob = await docGenService.generatePDF(this.selectedTemplate, this.formData)
                }

                // Descargar PDF
                this.downloadBlob(
                    pdfBlob,
                    this.isShowingExample
                        ? `${this.selectedTemplate}-ejemplo-${Date.now()}.pdf`
                        : `${this.selectedTemplate}-${Date.now()}.pdf`
                )

                const message = this.isShowingExample
                    ? 'PDF del ejemplo generado y descargado'
                    : 'PDF generado exitosamente'

                this.showMessage(message, 'success')

            } catch (error) {
                this.showMessage(error.friendlyMessage || 'Error generando PDF', 'error')
                console.error('Error generando PDF:', error)
            } finally {
                this.loadingPDF = false
            }
        },

        // ================================
        // TOGGLE ENTRE EJEMPLO Y EDICIÓN
        // ================================
        async toggleExample() {
            if (this.isShowingExample) {
                this.backToEdit()
            } else {
                await this.showExampleInPreview()
            }
        },

        backToEdit() {
            this.isShowingExample = false
            if (this.previousPreviewHTML) {
                this.previewHTML = this.previousPreviewHTML
                this.showMessage('Vista restaurada - Puedes seguir editando', 'info')
            } else {
                this.previewHTML = ''
                this.showMessage('Vuelve a generar tu preview personalizado', 'info')
            }
        },

        async showExampleInPreview() {
            if (!this.selectedTemplate) return

            this.loadingExample = true
            try {
                // Guardar el preview actual
                if (this.previewHTML && !this.isShowingExample) {
                    this.previousPreviewHTML = this.previewHTML
                }

                this.previewHTML = await docGenService.getTemplatePreview(this.selectedTemplate)
                this.isShowingExample = true
                this.previewMode = 'rendered'
                this.showMessage('Ejemplo cargado en el preview', 'success')

            } catch (error) {
                this.showMessage(error.friendlyMessage || 'Error cargando ejemplo', 'error')
                console.error('Error cargando ejemplo:', error)
            } finally {
                this.loadingExample = false
            }
        },

        // ================================
        // UTILIDADES
        // ================================
        async copyHtmlToClipboard() {
            if (!this.previewHTML) {
                this.showMessage('No hay HTML para copiar', 'warning')
                return
            }

            try {
                await navigator.clipboard.writeText(this.previewHTML)
                this.showMessage('HTML copiado al portapapeles', 'success')
            } catch (error) {
                // Fallback para navegadores antiguos
                const textArea = document.createElement('textarea')
                textArea.value = this.previewHTML
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)
                this.showMessage('HTML copiado al portapapeles', 'success')
            }
        },

        downloadBlob(blob, filename) {
            const url = window.URL.createObjectURL(new Blob([blob]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        },

        showMessage(message, color = 'info') {
            this.snackbar = {
                show: true,
                message,
                color
            }
        },

        onPreviewLoad() {
            console.log('Preview cargado')
        }
    }
}
</script>

<style scoped>
.panel-left {
    border-right: 1px solid #e0e0e0;
    background-color: #fafafa;
}

.panel-right {
    background-color: white;
}

.preview-container {
    height: 100%;
    overflow: auto;
}

.html-view {
    padding: 16px;
}

.rendered-view {
    height: calc(100vh - 160px);
}

.variables-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.variables-scroll-area {
    overflow-y: auto;
    max-height: calc(100vh - 300px);
    padding-right: 8px;
}

.variables-scroll-area::-webkit-scrollbar {
    width: 6px;
}

.variables-scroll-area::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.variables-scroll-area::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

.variables-scroll-area::-webkit-scrollbar-thumb:hover {
    background: #555;
}

@media (max-width: 960px) {
    .panel-left {
        border-right: none;
        border-bottom: 1px solid #e0e0e0;
    }
}

.html-code {
    background-color: #f5f5f5;
    padding: 16px;
    border-radius: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.4;
    max-height: 600px;
    overflow-y: auto;
}

.no-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
    text-align: center;
}

.no-preview p {
    margin-top: 16px;
    font-size: 16px;
}

.watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 80px;
    font-weight: bold;
    color: rgba(255, 0, 0, 0.1);
    z-index: 1000;
    pointer-events: none;
    user-select: none;
    font-family: Arial, sans-serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    letter-spacing: 10px;
}
</style>