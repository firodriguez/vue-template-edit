<!-- src/layouts/AppLayout.vue - CON ESTADO GLOBAL -->
<template>
    <v-app>
        <!-- ================================ -->
        <!-- NAVIGATION DRAWER (SIDEBAR) -->
        <!-- ================================ -->
        <v-navigation-drawer v-model="drawer" :rail="isRailMode" permanent color="grey-lighten-5" border :width="280">
            <!-- LOGO Y TÍTULO -->
            <v-list-item class="px-2">
                <template v-slot:prepend>
                    <v-avatar :color="isRailMode ? 'transparent' : 'primary'" :size="isRailMode ? 32 : 40" class="mr-2">
                        <v-icon :color="isRailMode ? 'primary' : 'white'" :size="isRailMode ? 'default' : 'large'">
                            mdi-rocket
                        </v-icon>
                    </v-avatar>
                </template>

                <v-list-item-title v-if="!isRailMode" class="text-h6 font-weight-bold">
                    Surfrut Platform
                </v-list-item-title>
                <v-list-item-subtitle v-if="!isRailMode" class="text-caption">
                    Template & API Management
                </v-list-item-subtitle>

                <template v-slot:append>
                    <v-btn variant="text" :icon="isRailMode ? 'mdi-chevron-right' : 'mdi-chevron-left'"
                        @click="toggleRailMode" size="small"></v-btn>
                </template>
            </v-list-item>

            <v-divider class="mx-3 mb-2"></v-divider>

            <!-- NAVEGACIÓN PRINCIPAL -->
            <v-list density="compact" nav>
                <!-- Dashboard Principal -->
                <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard"
                    :to="{ name: 'dashboard' }" color="primary" class="mb-1"></v-list-item>

                <!-- SECCIÓN DOCGEN SERVICES -->
                <v-list-group value="docgen" fluid>
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="mdi-file-document-multiple"
                            :title="isRailMode ? '' : 'DocGen Services'" class="text-primary font-weight-medium">
                        </v-list-item>
                    </template>

                    <v-list-item prepend-icon="mdi-file-document-edit" title="Editor de Templates"
                        value="template-editor" :to="{ name: 'docgen-editor' }" color="primary"
                        class="pl-12"></v-list-item>

                    <v-list-item prepend-icon="mdi-folder-multiple" title="Gestión de Templates"
                        value="template-manager" :to="{ name: 'docgen-manager' }" color="primary"
                        class="pl-12"></v-list-item>

                    <v-list-item prepend-icon="mdi-chart-line" title="Dashboard DocGen" value="docgen-dashboard"
                        :to="{ name: 'docgen-dashboard' }" color="primary" class="pl-12"></v-list-item>
                </v-list-group>

                <v-divider class="my-3 mx-3"></v-divider>

                <!-- CONFIGURACIÓN Y AYUDA -->
                <v-list-item prepend-icon="mdi-cog" title="Configuración" :to="{ name: 'settings' }"
                    class="mb-1"></v-list-item>

                <v-list-item prepend-icon="mdi-help-circle" title="Ayuda" :to="{ name: 'help' }"></v-list-item>
            </v-list>

            <!-- STATUS FOOTER -->
            <template v-slot:append>
                <div class="pa-3 border-t">
                    <!-- STATUS COMPACTO -->
                    <div v-if="!isRailMode" class="mb-3">
                        <div class="text-caption text-grey mb-2">Estado de Servicios</div>
                        <div class="d-flex align-center justify-space-between">
                            <span class="text-caption">DocGen</span>
                            <v-chip :color="servicesStore.getServiceStatus('docgen') === 'online' ? 'success' : 'error'"
                                size="x-small" variant="flat">
                                {{ servicesStore.getServiceStatus('docgen') === 'online' ? 'Online' : 'Offline' }}
                            </v-chip>
                        </div>
                    </div>

                    <!-- BOTÓN VERIFICAR SERVICIOS -->
                    <v-btn v-if="!isRailMode" color="primary" variant="tonal" size="small" @click="manualCheckServices"
                        :loading="servicesStore.isLoading()" block>
                        <v-icon left size="small">mdi-refresh</v-icon>
                        Verificar
                    </v-btn>

                    <v-btn v-else color="primary" variant="tonal" icon="mdi-refresh" size="small"
                        @click="manualCheckServices" :loading="servicesStore.isLoading()"></v-btn>
                </div>
            </template>
        </v-navigation-drawer>

        <!-- APP BAR Y MAIN CONTENT (sin cambios) -->
        <v-app-bar :color="currentPageColor" dark elevation="1" height="64">
            <template v-slot:prepend>
                <v-app-bar-nav-icon @click="toggleSidebar"
                    :title="drawer ? 'Ocultar menú' : 'Mostrar menú'"></v-app-bar-nav-icon>
            </template>

            <v-app-bar-title class="font-weight-bold">
                {{ currentPageTitle }}
            </v-app-bar-title>

            <v-breadcrumbs v-if="breadcrumbs.length > 1 && !isMobile" :items="breadcrumbs" class="pa-0"
                density="compact">
                <template v-slot:divider>
                    <v-icon size="small" color="white">mdi-chevron-right</v-icon>
                </template>
            </v-breadcrumbs>

            <v-spacer></v-spacer>
        </v-app-bar>

        <v-main>
            <router-view />
        </v-main>

        <!-- GLOBAL NOTIFICATIONS -->
        <v-snackbar v-model="globalNotification.show" :color="globalNotification.color"
            :timeout="globalNotification.timeout" location="top right" vertical>
            <div class="d-flex align-center">
                <v-icon left class="mr-2">
                    {{ globalNotification.icon }}
                </v-icon>
                <div>
                    <strong>{{ globalNotification.title }}</strong>
                    <div class="text-caption">{{ globalNotification.message }}</div>
                </div>
            </div>

            <template v-slot:actions>
                <v-btn variant="text" @click="globalNotification.show = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
import { useServicesStore } from '@/stores/servicesStore.js'

export default {
    name: 'AppLayout',

    setup() {
        // Usar el store global
        const servicesStore = useServicesStore()
        return { servicesStore }
    },

    data() {
        return {
            // Navegación
            drawer: true,
            isRailMode: false,
            isMobile: false,

            // Control de verificaciones
            autoCheckInterval: null,
            lastCheckTime: 0,
            AUTO_CHECK_COOLDOWN: 3 * 60 * 1000,
            MANUAL_CHECK_COOLDOWN: 2000,

            // Notificaciones globales
            globalNotification: {
                show: false,
                title: '',
                message: '',
                color: 'info',
                icon: 'mdi-information',
                timeout: 4000
            }
        }
    },

    computed: {
        currentPageTitle() {
            const routeMap = {
                'dashboard': '🏠 Dashboard Principal',
                'docgen-editor': '✏️ Editor de Templates',
                'docgen-manager': '📁 Gestión de Templates',
                'docgen-dashboard': '📊 Dashboard DocGen',
                'settings': '⚙️ Configuración',
                'help': '❓ Ayuda'
            }
            return routeMap[this.$route.name] || 'Surfrut Platform'
        },

        currentPageColor() {
            const colorMap = {
                'dashboard': 'primary',
                'docgen-editor': 'purple',
                'docgen-manager': 'blue',
                'docgen-dashboard': 'purple',
                'settings': 'grey-darken-1',
                'help': 'orange'
            }
            return colorMap[this.$route.name] || 'primary'
        },

        breadcrumbs() {
            const route = this.$route
            const breadcrumbs = []

            breadcrumbs.push({
                title: 'Inicio',
                disabled: false,
                to: { name: 'dashboard' }
            })

            if (route.name?.startsWith('docgen')) {
                breadcrumbs.push({
                    title: 'DocGen',
                    disabled: true
                })

                const docgenRoutes = {
                    'docgen-editor': 'Editor',
                    'docgen-manager': 'Gestión',
                    'docgen-dashboard': 'Dashboard'
                }

                if (docgenRoutes[route.name]) {
                    breadcrumbs.push({
                        title: docgenRoutes[route.name],
                        disabled: true
                    })
                }
            }

            return breadcrumbs
        }
    },

    async mounted() {
        await this.initializeLayout()
    },

    beforeUnmount() {
        this.cleanup()
    },

    methods: {
        async initializeLayout() {
            console.log('🏗️ [AppLayout] Inicializando layout...')

            this.checkMobile()
            this.restoreUserPreferences()

            // Verificación inicial usando el store global
            await this.performInitialHealthCheck()
            this.setupAutoCheck()

            window.addEventListener('resize', this.checkMobile)
            console.log('✅ [AppLayout] Layout inicializado')
        },

        async performInitialHealthCheck() {
            console.log('🏥 [AppLayout] Verificación inicial usando store global...')

            try {
                await this.servicesStore.checkAllServices(false)

                const docgenStatus = this.servicesStore.getServiceStatus('docgen')
                if (docgenStatus !== 'online') {
                    this.showGlobalNotification({
                        title: 'Servicio Offline',
                        message: 'DocGen no está disponible',
                        color: 'warning',
                        icon: 'mdi-alert',
                        timeout: 10000
                    })
                }

            } catch (error) {
                console.error('❌ [AppLayout] Error en verificación inicial:', error)
            }
        },

        async manualCheckServices() {
            const now = Date.now()

            // Prevenir spam
            if (now - this.lastCheckTime < this.MANUAL_CHECK_COOLDOWN) {
                const waitTime = Math.ceil((this.MANUAL_CHECK_COOLDOWN - (now - this.lastCheckTime)) / 1000)
                this.showGlobalNotification({
                    title: 'Espera un momento',
                    message: `Espera ${waitTime} segundos antes de verificar de nuevo`,
                    color: 'warning',
                    icon: 'mdi-timer'
                })
                return
            }

            this.lastCheckTime = now
            console.log('🔄 [AppLayout] Verificación manual usando store global')

            try {
                const previousStatus = this.servicesStore.getServiceStatus('docgen')
                await this.servicesStore.checkAllServices(true) // Forzar refresh
                const newStatus = this.servicesStore.getServiceStatus('docgen')

                // Notificar cambios o estado actual
                if (previousStatus !== newStatus) {
                    this.showGlobalNotification({
                        title: newStatus === 'online' ? 'Servicio Restaurado' : 'Servicio Offline',
                        message: `DocGen: ${newStatus}`,
                        color: newStatus === 'online' ? 'success' : 'error',
                        icon: newStatus === 'online' ? 'mdi-check-circle' : 'mdi-alert'
                    })
                } else {
                    this.showGlobalNotification({
                        title: 'Verificación Completa',
                        message: `DocGen: ${newStatus}`,
                        color: newStatus === 'online' ? 'success' : 'warning',
                        icon: 'mdi-information',
                        timeout: 2000
                    })
                }

            } catch (error) {
                console.error('❌ [AppLayout] Error en verificación manual:', error)
                this.showGlobalNotification({
                    title: 'Error de Conexión',
                    message: 'No se pudo verificar el estado de los servicios',
                    color: 'error',
                    icon: 'mdi-wifi-off'
                })
            }
        },

        setupAutoCheck() {
            if (import.meta.env.DEV && !import.meta.env.VITE_ENABLE_AUTO_CHECK) {
                console.log('🔧 [AppLayout] Auto-verificación deshabilitada en desarrollo')
                return
            }

            console.log('🔧 [AppLayout] Configurando auto-verificación cada 3 minutos')

            this.autoCheckInterval = setInterval(async () => {
                console.log('⏰ [AppLayout] Auto-verificación programada...')
                try {
                    await this.servicesStore.checkAllServices(true)
                } catch (error) {
                    console.error('❌ [AppLayout] Error en auto-verificación:', error)
                }
            }, this.AUTO_CHECK_COOLDOWN)
        },

        checkMobile() {
            this.isMobile = window.innerWidth < 960
            if (this.isMobile && this.isRailMode) {
                this.isRailMode = false
            }
        },

        toggleSidebar() {
            if (this.isMobile) {
                this.drawer = !this.drawer
            } else {
                this.isRailMode = !this.isRailMode
            }

            localStorage.setItem('railMode', this.isRailMode.toString())
            localStorage.setItem('drawerOpen', this.drawer.toString())
        },

        toggleRailMode() {
            this.isRailMode = !this.isRailMode
            localStorage.setItem('railMode', this.isRailMode.toString())
        },

        showGlobalNotification({ title, message, color = 'info', icon = 'mdi-information', timeout = 4000 }) {
            this.globalNotification = {
                show: true,
                title,
                message,
                color,
                icon,
                timeout
            }
        },

        restoreUserPreferences() {
            const savedRailMode = localStorage.getItem('railMode')
            if (savedRailMode !== null) {
                this.isRailMode = savedRailMode === 'true'
            }

            const savedDrawer = localStorage.getItem('drawerOpen')
            if (savedDrawer !== null) {
                this.drawer = savedDrawer === 'true'
            }
        },

        cleanup() {
            console.log('🧹 [AppLayout] Limpiando recursos...')

            if (this.autoCheckInterval) {
                clearInterval(this.autoCheckInterval)
                this.autoCheckInterval = null
            }

            window.removeEventListener('resize', this.checkMobile)
            console.log('✅ [AppLayout] Recursos limpiados')
        }
    }
}
</script>

<style scoped>
.v-navigation-drawer {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-list-group__items {
    background-color: rgba(0, 0, 0, 0.02);
}

.v-list-item--active {
    background-color: rgba(var(--v-theme-primary), 0.12) !important;
    color: rgb(var(--v-theme-primary));
}

.v-list-item--active .v-list-item__prepend>.v-icon {
    color: rgb(var(--v-theme-primary));
}

.border-t {
    border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

@media (max-width: 960px) {
    .v-navigation-drawer {
        position: fixed !important;
    }
}

.v-chip {
    will-change: auto;
}
</style>