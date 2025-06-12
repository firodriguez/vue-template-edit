<!-- src/views/docgen/TemplateEditor.vue - VERSIÓN LIMPIA -->
<template>
    <v-container fluid class="pa-6">
        <!-- ================================ -->
        <!-- HEADER SIMPLE (como DocGenDashboard) -->
        <!-- ================================ -->
        <div class="d-flex align-center justify-space-between mb-6">
            <div class="d-flex align-center">
                <v-icon size="40" color="surfrut" class="mr-3">mdi-file-document-edit</v-icon>
                <div>
                    <h1 class="text-h4 font-weight-bold">Editor de Templates</h1>
                    <p class="text-subtitle-1 text-grey-darken-1 mb-0">
                        Crea y edita documentos PDF con datos dinámicos
                    </p>
                </div>
            </div>

            <!-- STATUS Y ACCIONES -->
            <div class="d-flex align-center ga-3">
                <v-tooltip text="Estado de conexión con generate.surfrut.com" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-chip v-bind="props" :color="connectionStatus ? 'success' : 'error'" size="small">
                            <v-icon left size="small">
                                {{ connectionStatus ? 'mdi-cloud-check' : 'mdi-cloud-off' }}
                            </v-icon>
                            {{ connectionStatus ? 'Online' : 'Offline' }}
                        </v-chip>
                    </template>
                </v-tooltip>

                <v-btn icon="mdi-refresh" size="small" @click="checkConnection" :loading="loadingConnection"
                    variant="outlined"></v-btn>
            </div>
        </div>

        <!-- ================================ -->
        <!-- CONTENIDO PRINCIPAL EN CARDS -->
        <!-- ================================ -->
        <v-row>
            <!-- PANEL IZQUIERDO: Configuración -->
            <v-col cols="12" lg="4">
                <v-card elevation="2" class="h-100">
                    <!-- SELECCIÓN DE TEMPLATE -->
                    <v-card-title class="bg-primary text-white">
                        <v-icon left>mdi-file-document</v-icon>
                        Configuración del Template
                    </v-card-title>

                    <v-card-text class="pa-4">
                        <!-- Template Selector -->
                        <v-select v-model="selectedTemplate" :items="templates" item-title="displayName"
                            item-value="name" label="Seleccionar template" variant="outlined"
                            :loading="loadingTemplates" @update:model-value="loadTemplateDetails" class="mb-4">
                            <template v-slot:item="{ props, item }">
                                <v-list-item v-bind="props">
                                    <template v-slot:prepend>
                                        <v-icon color="primary">mdi-file-document</v-icon>
                                    </template>
                                    <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ item.raw.formattedSize }} • {{ item.raw.formattedDate }}
                                    </v-list-item-subtitle>
                                </v-list-item>
                            </template>
                        </v-select>

                        <!-- Botones de Acción -->
                        <v-row class="mb-4">
                            <v-col cols="6">
                                <v-btn color="primary" variant="outlined" @click="loadTemplates"
                                    :loading="loadingTemplates" block>
                                    <v-icon left>mdi-refresh</v-icon>
                                    Actualizar
                                </v-btn>
                            </v-col>
                            <v-col cols="6">
                                <v-btn color="info" variant="outlined" @click="toggleExample" :loading="loadingExample"
                                    :disabled="!selectedTemplate" block>
                                    <v-icon left>mdi-eye</v-icon>
                                    {{ isShowingExample ? 'Editar' : 'Ejemplo' }}
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-divider class="mb-4"></v-divider>

                        <!-- VARIABLES DEL TEMPLATE -->
                        <div v-if="templateData">
                            <div class="d-flex align-center mb-3">
                                <v-icon color="orange" class="mr-2">mdi-variable</v-icon>
                                <h3 class="text-h6">Variables</h3>
                                <v-spacer></v-spacer>
                                <v-chip size="small" color="orange">
                                    {{ templateData.normalVariables?.length || 0 }}
                                </v-chip>
                            </div>

                            <v-alert v-if="templateData.loops?.length" type="info" variant="tonal" class="mb-4"
                                density="compact">
                                <strong>Arrays detectados:</strong> {{ templateData.loops.join(', ') }}
                            </v-alert>

                            <!-- Scroll container para variables -->
                            <div style="max-height: 400px; overflow-y: auto;">
                                <!-- Variables simples -->
                                <div v-for="variable in templateData.normalVariables" :key="variable" class="mb-3">
                                    <v-text-field v-model="formData[variable]" :label="variable" variant="outlined"
                                        density="compact" @input="generatePreview" clearable>
                                        <template v-slot:prepend-inner>
                                            <v-icon size="small" color="grey">mdi-code-braces</v-icon>
                                        </template>
                                    </v-text-field>
                                </div>

                                <!-- Arrays -->
                                <div v-if="hasArrays" class="mt-4">
                                    <div v-for="arrayInfo in templateData.arrayInfo" :key="arrayInfo.name" class="mb-4">
                                        <div class="d-flex align-center mb-3">
                                            <v-icon color="purple" class="mr-2">mdi-table</v-icon>
                                            <strong>{{ arrayInfo.name }}</strong>
                                            <v-spacer></v-spacer>
                                            <v-chip size="x-small" color="purple">
                                                {{ formData[arrayInfo.name]?.length || 0 }} items
                                            </v-chip>
                                        </div>

                                        <v-btn color="purple" size="small"
                                            @click="addArrayItem(arrayInfo.name, arrayInfo.variables)" block
                                            class="mb-3" variant="tonal">
                                            <v-icon left size="small">mdi-plus</v-icon>
                                            Agregar {{ arrayInfo.name }}
                                        </v-btn>

                                        <!-- Lista de items del array con cards simples -->
                                        <div v-if="formData[arrayInfo.name]?.length" class="array-items">
                                            <v-card v-for="(item, index) in formData[arrayInfo.name]"
                                                :key="`${arrayInfo.name}-${index}`" class="mb-2" variant="outlined"
                                                elevation="1">
                                                <!-- Header del item -->
                                                <v-card-title class="py-2 text-subtitle-2 d-flex align-center">
                                                    <v-icon left size="small" color="purple">
                                                        mdi-numeric-{{ index + 1 }}-circle
                                                    </v-icon>
                                                    {{ arrayInfo.name }} {{ index + 1 }}

                                                    <!-- Preview de los datos del item -->
                                                    <v-spacer></v-spacer>
                                                    <span class="text-caption text-grey mr-2">
                                                        {{ getItemPreview(item) }}
                                                    </span>

                                                    <!-- Toggle para expandir/contraer -->
                                                    <v-btn
                                                        :icon="expandedItems.has(`${arrayInfo.name}-${index}`) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                                        size="x-small" variant="text"
                                                        @click="toggleItemExpansion(arrayInfo.name, index)"></v-btn>

                                                    <!-- Botón eliminar -->
                                                    <v-btn icon="mdi-delete" size="x-small" color="error" variant="text"
                                                        @click="removeArrayItem(arrayInfo.name, index)"></v-btn>
                                                </v-card-title>

                                                <!-- Contenido expandible -->
                                                <v-expand-transition>
                                                    <v-card-text
                                                        v-show="expandedItems.has(`${arrayInfo.name}-${index}`)"
                                                        class="pt-0">
                                                        <!-- Grid de campos para mejor distribución -->
                                                        <v-row>
                                                            <v-col v-for="variable in arrayInfo.variables"
                                                                :key="variable"
                                                                :cols="getFieldCols(arrayInfo.variables.length)"
                                                                class="py-1">
                                                                <v-text-field v-model="item[variable]" :label="variable"
                                                                    density="compact" variant="outlined"
                                                                    @input="generatePreview" hide-details>
                                                                    <template v-slot:prepend-inner>
                                                                        <v-icon size="x-small"
                                                                            color="purple">mdi-form-textbox</v-icon>
                                                                    </template>
                                                                </v-text-field>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-text>
                                                </v-expand-transition>
                                            </v-card>
                                        </div>

                                        <!-- Quick Actions para arrays con muchos items -->
                                        <div v-if="formData[arrayInfo.name]?.length > 1" class="mt-2">
                                            <v-row>
                                                <v-col cols="6">
                                                    <v-btn size="x-small" variant="outlined" color="purple"
                                                        @click="expandAllItems(arrayInfo.name)" block>
                                                        <v-icon left size="x-small">mdi-arrow-expand-vertical</v-icon>
                                                        Expandir Todo
                                                    </v-btn>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-btn size="x-small" variant="outlined" color="purple"
                                                        @click="collapseAllItems(arrayInfo.name)" block>
                                                        <v-icon left size="x-small">mdi-arrow-collapse-vertical</v-icon>
                                                        Contraer Todo
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-card-text>

                    <!-- Botón de Preview en footer -->
                    <v-card-actions class="pa-4">
                        <v-btn color="orange" block @click="generatePreview" :loading="loadingPreview"
                            :disabled="!selectedTemplate || isShowingExample" size="large">
                            <v-icon left>mdi-eye</v-icon>
                            Actualizar Preview
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

            <!-- PANEL DERECHO: Preview -->
            <v-col cols="12" lg="8">
                <v-card elevation="2" class="h-100">
                    <!-- Header del Preview -->
                    <v-card-title class="bg-blue text-white d-flex align-center">
                        <v-icon left>mdi-eye</v-icon>
                        Preview: {{ selectedTemplate || 'Sin template seleccionado' }}

                        <v-spacer></v-spacer>

                        <!-- Controles del Preview -->
                        <div class="d-flex align-center ga-2">
                            <!-- Botón PDF -->
                            <v-btn v-if="shouldShowPDFButton" color="success" size="small" @click="generatePDF"
                                :loading="loadingPDF" variant="flat">
                                <v-icon left size="small">mdi-file-pdf</v-icon>
                                {{ isShowingExample ? 'PDF Ejemplo' : 'Generar PDF' }}
                            </v-btn>

                            <!-- Botón Copiar HTML -->
                            <v-btn v-if="previewHTML" color="white" size="small" @click="copyHtmlToClipboard"
                                variant="outlined">
                                <v-icon left size="small">mdi-content-copy</v-icon>
                                Copiar HTML
                            </v-btn>

                            <!-- Toggle Vista -->
                            <v-btn-toggle v-model="previewMode" mandatory density="compact">
                                <v-btn value="rendered" size="small">
                                    <v-icon size="small">mdi-web</v-icon>
                                    Vista
                                </v-btn>
                                <v-btn value="html" size="small">
                                    <v-icon size="small">mdi-code-tags</v-icon>
                                    HTML
                                </v-btn>
                            </v-btn-toggle>
                        </div>
                    </v-card-title>

                    <!-- Contenido del Preview -->
                    <v-card-text class="pa-0" style="height: calc(100vh - 300px);">
                        <!-- Vista Renderizada -->
                        <div v-if="previewMode === 'rendered'" class="preview-container">
                            <div v-if="!previewHTML" class="no-preview">
                                <v-icon size="64" color="grey">mdi-file-document-outline</v-icon>
                                <p class="text-h6 mt-4">Selecciona un template y genera el preview</p>
                                <v-btn v-if="selectedTemplate" color="primary" @click="generatePreview"
                                    :loading="loadingPreview" class="mt-4">
                                    <v-icon left>mdi-eye</v-icon>
                                    Generar Preview
                                </v-btn>
                            </div>
                            <div v-else style="position: relative; height: 100%;">
                                <!-- Marca de agua si es ejemplo -->
                                <div v-if="isShowingExample" class="watermark">EJEMPLO</div>
                                <iframe ref="previewFrame" :srcdoc="previewHTML"
                                    style="width: 100%; height: 100%; border: none;" @load="onPreviewLoad"></iframe>
                            </div>
                        </div>

                        <!-- Vista HTML -->
                        <div v-else class="html-view pa-4">
                            <v-card variant="outlined">
                                <v-card-title class="py-2">
                                    <v-icon left color="orange">mdi-code-tags</v-icon>
                                    Código HTML Generado
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" size="small" @click="copyHtmlToClipboard"
                                        :disabled="!previewHTML" variant="outlined">
                                        <v-icon left size="small">mdi-content-copy</v-icon>
                                        Copiar
                                    </v-btn>
                                </v-card-title>
                                <v-card-text>
                                    <pre class="html-code">{{ previewHTML || 'No hay contenido HTML generado' }}</pre>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <!-- ================================ -->
    <!-- SNACKBAR PARA NOTIFICACIONES -->
    <!-- ================================ -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="bottom right">
        {{ snackbar.message }}
        <template v-slot:actions>
            <v-btn variant="text" @click="snackbar.show = false" size="small">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
// ================================
// IMPORTACIONES
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

            // Control de expansión de items de arrays
            expandedItems: new Set(),

            // Preview
            previewMode: 'rendered',
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
                        displayName: template.name,
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

            if (this.templateData?.arrayInfo) {
                this.templateData.arrayInfo.forEach(arrayInfo => {
                    this.formData[arrayInfo.name] = []
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
                    pdfBlob = await docGenService.generateExamplePDF(this.selectedTemplate)
                } else {
                    const validation = docGenService.validateTemplateData(this.formData)

                    if (!validation.isValid) {
                        this.showMessage(`Errores: ${validation.errors.join(', ')}`, 'error')
                        return
                    }

                    pdfBlob = await docGenService.generatePDF(this.selectedTemplate, this.formData)
                }

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
        // UTILIDADES PARA ARRAYS
        // ================================
        getItemPreview(item) {
            // Mostrar los primeros valores no vacíos como preview
            const values = Object.values(item).filter(val => val && val.trim())
            if (values.length === 0) return 'Sin datos'

            const preview = values.slice(0, 2).join(', ')
            return preview.length > 30 ? preview.substring(0, 30) + '...' : preview
        },

        getFieldCols(fieldCount) {
            // Distribuir campos en columnas según la cantidad
            if (fieldCount <= 2) return 12
            if (fieldCount <= 4) return 6
            if (fieldCount <= 6) return 4
            return 3 // Para 7+ campos usar 3 columnas
        },

        toggleItemExpansion(arrayName, index) {
            const key = `${arrayName}-${index}`
            if (this.expandedItems.has(key)) {
                this.expandedItems.delete(key)
            } else {
                this.expandedItems.add(key)
            }
        },

        expandAllItems(arrayName) {
            if (!this.formData[arrayName]) return

            this.formData[arrayName].forEach((_, index) => {
                this.expandedItems.add(`${arrayName}-${index}`)
            })
        },

        collapseAllItems(arrayName) {
            if (!this.formData[arrayName]) return

            this.formData[arrayName].forEach((_, index) => {
                this.expandedItems.delete(`${arrayName}-${index}`)
            })
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
.preview-container {
    height: 100%;
    overflow: auto;
}

.html-view {
    height: calc(100vh - 300px);
    overflow-y: auto;
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

.watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 60px;
    font-weight: bold;
    color: rgba(255, 0, 0, 0.1);
    z-index: 1000;
    pointer-events: none;
    user-select: none;
    font-family: Arial, sans-serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    letter-spacing: 5px;
}

.ga-3 {
    gap: 12px;
}

.ga-2 {
    gap: 8px;
}

/* Estilos para los arrays */
.array-items {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 4px;
}

.array-items::-webkit-scrollbar {
    width: 4px;
}

.array-items::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
}

.array-items::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
}

.array-items::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>