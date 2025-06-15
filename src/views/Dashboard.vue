<!-- src/views/Dashboard.vue - CON ESTADO GLOBAL -->
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

            <!-- 🔧 USANDO EL STORE GLOBAL -->
            <v-chip :color="servicesStore.getServiceStatus('docgen') === 'online' ? 'success' : 'error'" size="small"
              class="mb-4">
              <v-icon left size="small">
                {{ servicesStore.getServiceStatus('docgen') === 'online' ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
              {{ servicesStore.getServiceStatus('docgen') === 'online' ? 'Online' : 'Offline' }}
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

    <!-- INFORMACIÓN DEL SISTEMA CON ESTADO GLOBAL -->
    <v-row class="mt-8">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">
          <v-icon left color="primary">mdi-lightning-bolt</v-icon>
          Información
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

      <!-- 🔧 NUEVA CARD: ESTADO DE SERVICIOS EN TIEMPO REAL -->
      <v-col cols="12" md="4">
        <v-card elevation="1"
          :color="servicesStore.getServiceStatus('docgen') === 'online' ? 'green-lighten-5' : 'red-lighten-5'">
          <v-card-text class="pa-6">
            <h3 class="text-h6 mb-3">
              <v-icon left :color="servicesStore.getServiceStatus('docgen') === 'online' ? 'green' : 'red'">
                mdi-server-network
              </v-icon>
              Estado de Servicios
            </h3>

            <div class="d-flex justify-space-between mb-2">
              <span>DocGen API:</span>
              <v-chip :color="servicesStore.getServiceStatus('docgen') === 'online' ? 'success' : 'error'" size="small">
                <v-icon left size="small">
                  {{ servicesStore.getServiceStatus('docgen') === 'online' ? 'mdi-check' : 'mdi-close' }}
                </v-icon>
                {{ servicesStore.getServiceStatus('docgen') === 'online' ? 'Online' : 'Offline' }}
              </v-chip>
            </div>

            <div class="d-flex justify-space-between mb-3">
              <span>Última verificación:</span>
              <span class="text-caption">{{ formatLastCheck() }}</span>
            </div>

            <!-- BOTÓN PARA VERIFICAR DESDE EL DASHBOARD -->
            <v-btn color="primary" variant="tonal" size="small" @click="refreshServicesStatus"
              :loading="servicesStore.isLoading()" block>
              <v-icon left size="small">mdi-refresh</v-icon>
              Verificar Estado
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useServicesStore } from '@/stores/servicesStore.js'

export default {
  name: 'Dashboard',

  setup() {
    // 🔧 USAR EL STORE GLOBAL
    const servicesStore = useServicesStore()
    return { servicesStore }
  },

  data() {
    return {
      appInfo: {
        version: '1.0.0',
        vueVersion: '3.5.13',
        isDev: import.meta.env.DEV,
        date: this.mostrarFechayhora()
      }
    }
  },

  computed: {
    // 🔧 COMPUTED REACTIVO USANDO EL STORE
    servicesSummary() {
      return this.servicesStore.getServicesSummary()
    }
  },

  async mounted() {
    await this.loadDashboardData()
  },

  methods: {
    async loadDashboardData() {
      try {
        console.log('📊 [Dashboard] Cargando datos usando store global...')

        // El store ya maneja el estado, solo verificamos si es necesario
        const lastCheck = this.servicesStore.getLastCheckTime()
        const timeSinceLastCheck = Date.now() - lastCheck

        // Si hace más de 1 minuto que no se verifica, hacer check
        if (timeSinceLastCheck > 60000) {
          await this.servicesStore.checkAllServices()
        }

        console.log('✅ [Dashboard] Datos cargados:', this.servicesStore.getAllServices())

      } catch (error) {
        console.error('❌ [Dashboard] Error cargando datos:', error)
      }
    },

    // 🔧 MÉTODO PARA VERIFICAR DESDE EL DASHBOARD
    async refreshServicesStatus() {
      try {
        console.log('🔄 [Dashboard] Verificación manual solicitada')
        await this.servicesStore.checkAllServices(true) // Forzar refresh

        // Opcional: mostrar notificación de éxito
        console.log('✅ [Dashboard] Estado actualizado')
      } catch (error) {
        console.error('❌ [Dashboard] Error actualizando estado:', error)
      }
    },

    formatLastCheck() {
      const lastCheck = this.servicesStore.getLastCheckTime()
      if (!lastCheck) return 'Nunca'

      const now = Date.now()
      const diff = now - lastCheck

      if (diff < 60000) return 'Hace menos de 1 min'
      if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`

      return new Date(lastCheck).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
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