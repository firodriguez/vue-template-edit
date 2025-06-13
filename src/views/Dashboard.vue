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
              <v-avatar color="blue" size="48" class="mr-4">
                <v-icon color="white" size="24">mdi-file-document-multiple</v-icon>
              </v-avatar>
              <div>
                <h3 class="text-h6 font-weight-bold">DocGen Services</h3>
                <p class="text-caption text-grey-darken-1 mb-0">
                  Generación de documentos PDF
                </p>
              </div>
            </div>

            <v-chip :color="servicesStatus.docgen === 'online' ? 'success' : 'error'" size="small" class="mb-4">
              <v-icon left size="small">
                {{ servicesStatus.docgen === 'online' ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
              {{ servicesStatus.docgen === 'online' ? 'Online' : 'Offline' }}
            </v-chip>

            <div class="d-flex flex-column ga-2">
              <v-btn color="blue" variant="flat" :to="{ name: 'docgen-editor' }" block size="large">
                <v-icon left>mdi-file-document-edit</v-icon>
                Editor de Templates
              </v-btn>

              <v-btn color="blue" variant="tonal" :to="{ name: 'docgen-manager' }" block>
                <v-icon left>mdi-folder-multiple</v-icon>
                Gestión de Templates
              </v-btn>

              <v-btn color="purple" variant="tonal" :to="{ name: 'docgen-dashboard' }" block>
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

    <!-- ACCESOS RÁPIDOS -->
    <v-row class="mt-8">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">
          <v-icon left color="primary">mdi-lightning-bolt</v-icon>
          Informacion
        </h2>
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
              <strong>{{ appInfo.version }}</strong>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Entorno:</span>
              <v-chip :color="appInfo.isDev ? 'warning' : 'success'" size="x-small">
                {{ appInfo.isDev ? 'Desarrollo' : 'Producción' }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Fecha:</span>
              <strong>{{ appInfo.date }}</strong>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { checkAllServicesHealth } from '@/services/api/index.js'

export default {
  name: 'Dashboard',

  data() {
    return {
      servicesStatus: {
        docgen: 'unknown'
      },
      appInfo: {
        version: '1.0.0',
        vueVersion: '3.5.13', // O puedes obtenerla dinámicamente
        isDev: import.meta.env.DEV,
        date: this.mostrarFechayhora()
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

      } catch (error) {
        console.error('Error cargando datos del dashboard:', error)
      }
    },

    mostrarFechayhora() {
      const now = new Date()
      return now.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  }
}
</script>
