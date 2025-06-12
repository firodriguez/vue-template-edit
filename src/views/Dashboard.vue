<!-- src/views/Dashboard.vue - DASHBOARD PRINCIPAL -->
<template>
    <v-container fluid class="pa-6">
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center mb-6">
            <v-icon size="40" color="primary" class="mr-3">mdi-view-dashboard</v-icon>
            <div>
              <h1 class="text-h4 font-weight-bold">Dashboard Principal</h1>
              <p class="text-subtitle-1 text-grey-darken-1 mb-0">
                Centro de control de Surfrut Platform
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
  
      <!-- CARDS DE SERVICIOS DISPONIBLES -->
      <v-row>
        <v-col cols="12" md="6" lg="4">
          <v-card elevation="2" hover class="h-100">
            <v-card-text class="pa-6">
              <div class="d-flex align-center mb-4">
                <v-avatar color="surfrut" size="48" class="mr-4">
                  <v-icon color="white" size="24">mdi-file-document-multiple</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h6 font-weight-bold">DocGen Services</h3>
                  <p class="text-caption text-grey-darken-1 mb-0">
                    Generación de documentos PDF
                  </p>
                </div>
              </div>
              
              <v-chip 
                :color="servicesStatus.docgen === 'online' ? 'success' : 'error'"
                size="small"
                class="mb-4"
              >
                <v-icon left size="small">
                  {{ servicesStatus.docgen === 'online' ? 'mdi-check' : 'mdi-close' }}
                </v-icon>
                {{ servicesStatus.docgen === 'online' ? 'Online' : 'Offline' }}
              </v-chip>
  
              <div class="d-flex flex-column ga-2">
                <v-btn 
                  color="surfrut" 
                  variant="flat" 
                  :to="{ name: 'docgen-editor' }"
                  block
                  size="large"
                >
                  <v-icon left>mdi-file-document-edit</v-icon>
                  Editor de Templates
                </v-btn>
                
                <v-btn 
                  color="blue" 
                  variant="tonal" 
                  :to="{ name: 'docgen-manager' }"
                  block
                >
                  <v-icon left>mdi-folder-multiple</v-icon>
                  Gestión de Templates
                </v-btn>
                
                <v-btn 
                  color="purple" 
                  variant="tonal" 
                  :to="{ name: 'docgen-dashboard' }"
                  block
                >
                  <v-icon left>mdi-chart-line</v-icon>
                  Dashboard DocGen
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
  
        <!-- PLACEHOLDER PARA FUTURAS APIS -->
        <v-col cols="12" md="6" lg="4">
          <v-card elevation="1" class="h-100 opacity-75">
            <v-card-text class="pa-6">
              <div class="d-flex align-center mb-4">
                <v-avatar color="grey" size="48" class="mr-4">
                  <v-icon color="white" size="24">mdi-chart-bar</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h6 font-weight-bold text-grey">Analytics API</h3>
                  <p class="text-caption text-grey mb-0">
                    Próximamente
                  </p>
                </div>
              </div>
              
              <v-chip color="orange" size="small" class="mb-4">
                <v-icon left size="small">mdi-timer-sand</v-icon>
                En desarrollo
              </v-chip>
  
              <v-btn color="grey" variant="tonal" disabled block>
                <v-icon left>mdi-chart-line</v-icon>
                Dashboard Analytics
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="6" lg="4">
          <v-card elevation="1" class="h-100 opacity-75">
            <v-card-text class="pa-6">
              <div class="d-flex align-center mb-4">
                <v-avatar color="grey" size="48" class="mr-4">
                  <v-icon color="white" size="24">mdi-account-group</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h6 font-weight-bold text-grey">Users API</h3>
                  <p class="text-caption text-grey mb-0">
                    Próximamente
                  </p>
                </div>
              </div>
              
              <v-chip color="orange" size="small" class="mb-4">
                <v-icon left size="small">mdi-timer-sand</v-icon>
                En desarrollo
              </v-chip>
  
              <v-btn color="grey" variant="tonal" disabled block>
                <v-icon left>mdi-account-cog</v-icon>
                Gestión de Usuarios
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- ESTADÍSTICAS GENERALES -->
      <v-row class="mt-8">
        <v-col cols="12">
          <h2 class="text-h5 font-weight-bold mb-4">
            <v-icon left color="primary">mdi-chart-box</v-icon>
            Estadísticas del Sistema
          </h2>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="1" class="text-center pa-4">
            <v-icon size="40" color="primary" class="mb-2">mdi-file-document</v-icon>
            <h3 class="text-h4 font-weight-bold">{{ stats.totalTemplates }}</h3>
            <p class="text-body-2 text-grey">Templates Disponibles</p>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="1" class="text-center pa-4">
            <v-icon size="40" color="success" class="mb-2">mdi-file-pdf</v-icon>
            <h3 class="text-h4 font-weight-bold">{{ stats.totalPDFs }}</h3>
            <p class="text-body-2 text-grey">PDFs Generados</p>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="1" class="text-center pa-4">
            <v-icon size="40" color="orange" class="mb-2">mdi-clock</v-icon>
            <h3 class="text-h4 font-weight-bold">{{ stats.avgResponseTime }}</h3>
            <p class="text-body-2 text-grey">Tiempo Respuesta</p>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="1" class="text-center pa-4">
            <v-icon size="40" color="info" class="mb-2">mdi-server</v-icon>
            <h3 class="text-h4 font-weight-bold">{{ stats.serviceUptime }}</h3>
            <p class="text-body-2 text-grey">Uptime del Servicio</p>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- ACCESOS RÁPIDOS -->
      <v-row class="mt-8">
        <v-col cols="12">
          <h2 class="text-h5 font-weight-bold mb-4">
            <v-icon left color="primary">mdi-lightning-bolt</v-icon>
            Accesos Rápidos
          </h2>
        </v-col>
        
        <v-col cols="12" md="8">
          <v-card elevation="1">
            <v-card-text class="pa-6">
              <h3 class="text-h6 mb-4">Acciones Frecuentes</h3>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-btn 
                    color="primary" 
                    variant="outlined" 
                    :to="{ name: 'docgen-editor' }"
                    block
                    size="large"
                    class="mb-3"
                  >
                    <v-icon left>mdi-plus</v-icon>
                    Crear Nuevo Template
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-btn 
                    color="success" 
                    variant="outlined" 
                    :to="{ name: 'docgen-manager' }"
                    block
                    size="large"
                    class="mb-3"
                  >
                    <v-icon left>mdi-folder-search</v-icon>
                    Buscar Templates
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card elevation="1" color="blue-lighten-5">
            <v-card-text class="pa-6">
              <h3 class="text-h6 mb-3">
                <v-icon left color="blue">mdi-information</v-icon>
                Información del Sistema
              </h3>
              <div class="d-flex justify-space-between mb-2">
                <span>Versión:</span>
                <strong>v1.0.0</strong>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span>Último update:</span>
                <strong>Hoy</strong>
              </div>
              <div class="d-flex justify-space-between">
                <span>Servicios:</span>
                <strong>1 activo</strong>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>

<script>
import { checkAllServicesHealth, docGenService } from '@/services/api/index.js'

export default {
    name: 'Dashboard',

    data() {
        return {
            servicesStatus: {
                docgen: 'unknown'
            },
            stats: {
                totalTemplates: 0,
                totalPDFs: 'N/A',
                avgResponseTime: 'N/A',
                serviceUptime: '99.9%'
            }
        }
    },

    async mounted() {
        await this.loadDashboardData()
    },

    methods: {
        async loadDashboardData() {
            try {
                // Verificar estado de servicios
                const health = await checkAllServicesHealth()
                this.servicesStatus.docgen = health.docgen?.status || 'offline'

                // Cargar estadísticas básicas
                if (this.servicesStatus.docgen === 'online') {
                    await this.loadTemplateStats()
                }

            } catch (error) {
                console.error('Error cargando datos del dashboard:', error)
            }
        },

        async loadTemplateStats() {
            try {
                const response = await docGenService.getTemplates()
                if (response.success) {
                    this.stats.totalTemplates = response.templates.length
                }
            } catch (error) {
                console.error('Error cargando estadísticas:', error)
            }
        }
    }
}
</script>



