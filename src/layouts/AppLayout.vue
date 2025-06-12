<!-- src/layouts/AppLayout.vue - VERSIÓN CORREGIDA -->
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
                            <template v-if="!isRailMode" v-slot:append>
                                <v-chip :color="servicesStatus.docgen === 'online' ? 'success' : 'error'" size="x-small"
                                    variant="dot"></v-chip>
                            </template>
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

                <!-- SECCIÓN PARA FUTURAS APIS -->
                <v-list-group value="future-apis" v-if="showFutureModules">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="mdi-api" :title="isRailMode ? '' : 'Otros Servicios'"
                            class="text-grey font-weight-medium"></v-list-item>
                    </template>

                    <!-- <v-list-item prepend-icon="mdi-chart-bar" title="Analytics API" disabled class="pl-12">
                        <template v-slot:append>
                            <v-chip size="x-small" color="orange" variant="text">Próximamente</v-chip>
                        </template>
                    </v-list-item> -->

                    <v-list-item prepend-icon="mdi-account-group" title="Users API" disabled class="pl-12">
                        <template v-slot:append>
                            <v-chip size="x-small" color="orange" variant="text">Próximamente</v-chip>
                        </template>
                    </v-list-item>
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
                    <!-- STATUS DE SERVICIOS -->
                    <div v-if="!isRailMode" class="mb-3">
                        <v-list density="compact" class="bg-transparent">
                            <v-list-subheader class="text-caption px-0">Estado de Servicios</v-list-subheader>

                            <v-list-item v-for="(status, service) in servicesStatus" :key="service" class="px-0 py-1">
                                <template v-slot:prepend>
                                    <v-icon :color="status === 'online' ? 'success' : 'error'" size="small">
                                        {{ status === 'online' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                                    </v-icon>
                                </template>

                                <v-list-item-title class="text-caption">
                                    {{ service.toUpperCase() }}
                                </v-list-item-title>

                                <template v-slot:append>
                                    <v-chip :color="status === 'online' ? 'success' : 'error'" size="x-small"
                                        variant="flat">
                                        {{ status === 'online' ? 'Online' : 'Offline' }}
                                    </v-chip>
                                </template>
                            </v-list-item>
                        </v-list>
                    </div>

                    <!-- BOTÓN VERIFICAR SERVICIOS -->
                    <v-btn v-if="!isRailMode" color="primary" variant="tonal" size="small" @click="checkAllServices"
                        :loading="loadingServices" block>
                        <v-icon left size="small">mdi-refresh</v-icon>
                        Verificar Servicios
                    </v-btn>

                    <v-btn v-else color="primary" variant="tonal" icon="mdi-refresh" size="small"
                        @click="checkAllServices" :loading="loadingServices"></v-btn>
                </div>
            </template>
        </v-navigation-drawer>

        <!-- ================================ -->
        <!-- APP BAR (HEADER) -->
        <!-- ================================ -->
        <v-app-bar :color="currentPageColor" dark elevation="1" height="64">
            <!-- Menu button (siempre visible) -->
            <template v-slot:prepend>
                <v-app-bar-nav-icon @click="toggleSidebar"
                    :title="drawer ? 'Ocultar menú' : 'Mostrar menú'"></v-app-bar-nav-icon>
            </template>

            <!-- Título dinámico -->
            <v-app-bar-title class="font-weight-bold">
                {{ currentPageTitle }}
            </v-app-bar-title>

            <v-spacer></v-spacer>

            <!-- STATUS CHIP DEL SERVICIO ACTUAL -->
            <v-tooltip v-if="currentServiceStatus" :text="currentServiceStatus.tooltip" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-chip v-bind="props" :color="currentServiceStatus.color" size="small" class="mr-3">
                        <v-icon left size="small">
                            {{ currentServiceStatus.icon }}
                        </v-icon>
                        {{ currentServiceStatus.text }}
                    </v-chip>
                </template>
            </v-tooltip>

            <!-- BREADCRUMBS -->
            <v-breadcrumbs v-if="breadcrumbs.length > 1 && !isMobile" :items="breadcrumbs" class="pa-0"
                density="compact">
                <template v-slot:divider>
                    <v-icon size="small" color="white">mdi-chevron-right</v-icon>
                </template>
            </v-breadcrumbs>
        </v-app-bar>

        <!-- ================================ -->
        <!-- MAIN CONTENT AREA -->
        <!-- ================================ -->
        <v-main>
            <!-- Aquí se monta todo el contenido dinámico -->
            <router-view />
        </v-main>

        <!-- ================================ -->
        <!-- GLOBAL NOTIFICATIONS -->
        <!-- ================================ -->
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
import { checkAllServicesHealth } from '@/services/api/index.js'

export default {
    name: 'AppLayout',

    data() {
        return {
            // Navegación
            drawer: true, // Siempre true por defecto
            isRailMode: false,
            showFutureModules: true,

            // Detección mobile manual
            isMobile: false,

            // Estado de servicios
            servicesStatus: {
                docgen: 'unknown'
            },
            loadingServices: false,

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
                'docgen-editor': 'surfrut',
                'docgen-manager': 'blue',
                'docgen-dashboard': 'purple',
                'settings': 'grey-darken-1',
                'help': 'orange'
            }
            return colorMap[this.$route.name] || 'primary'
        },

        currentServiceStatus() {
            // Mostrar status solo en páginas de servicios específicos
            if (this.$route.name?.startsWith('docgen')) {
                const status = this.servicesStatus.docgen
                return {
                    color: status === 'online' ? 'success' : 'error',
                    icon: status === 'online' ? 'mdi-cloud-check' : 'mdi-cloud-off',
                    text: status === 'online' ? 'DocGen Online' : 'DocGen Offline',
                    tooltip: status === 'online'
                        ? 'Servicio DocGen funcionando correctamente'
                        : 'Servicio DocGen no disponible'
                }
            }
            return null
        },

        breadcrumbs() {
            const route = this.$route
            const breadcrumbs = []

            // Base breadcrumb
            breadcrumbs.push({
                title: 'Inicio',
                disabled: false,
                to: { name: 'dashboard' }
            })

            // Breadcrumbs específicos por ruta
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

    methods: {
        async initializeLayout() {
            // Detectar mobile manualmente
            this.checkMobile()

            // Restaurar preferencias guardadas
            this.restoreUserPreferences()

            // Verificar servicios inicial
            await this.checkAllServices()

            // Auto-verificar servicios cada 2 minutos
            setInterval(() => {
                this.checkAllServices(true) // silent = true
            }, 2 * 60 * 1000)

            // Listener para cambios de tamaño de pantalla
            window.addEventListener('resize', this.checkMobile)
        },

        checkMobile() {
            this.isMobile = window.innerWidth < 960

            // NO auto-ajustar drawer - dejar que el usuario controle
            // Solo ajustar rail mode en mobile
            if (this.isMobile && this.isRailMode) {
                this.isRailMode = false
            }
        },

        toggleSidebar() {
            if (this.isMobile) {
                // En mobile: toggle drawer
                this.drawer = !this.drawer
            } else {
                // En desktop: toggle rail mode
                this.isRailMode = !this.isRailMode
            }

            // Guardar preferencia
            localStorage.setItem('railMode', this.isRailMode.toString())
            localStorage.setItem('drawerOpen', this.drawer.toString())
        },

        toggleRailMode() {
            this.isRailMode = !this.isRailMode
            // Guardar preferencia
            localStorage.setItem('railMode', this.isRailMode.toString())
        },

        async checkAllServices(silent = false) {
            this.loadingServices = true
            try {
                const health = await checkAllServicesHealth()

                // Actualizar estado
                Object.keys(health).forEach(service => {
                    this.servicesStatus[service] = health[service].status
                })

                if (!silent) {
                    console.log('🔍 Estado de servicios:', health)

                    // Notificar servicios offline
                    const offlineServices = Object.entries(health)
                        .filter(([_, healthInfo]) => healthInfo.status !== 'online')
                        .map(([name]) => name)

                    if (offlineServices.length > 0) {
                        this.showGlobalNotification({
                            title: 'Servicios Offline',
                            message: `${offlineServices.join(', ')} no están disponibles`,
                            color: 'warning',
                            icon: 'mdi-alert'
                        })
                    } else {
                        this.showGlobalNotification({
                            title: 'Servicios Online',
                            message: 'Todos los servicios están funcionando correctamente',
                            color: 'success',
                            icon: 'mdi-check-circle'
                        })
                    }
                }

            } catch (error) {
                console.error('Error verificando servicios:', error)
                if (!silent) {
                    this.showGlobalNotification({
                        title: 'Error de Conexión',
                        message: 'No se pudo verificar el estado de los servicios',
                        color: 'error',
                        icon: 'mdi-wifi-off'
                    })
                }
            } finally {
                this.loadingServices = false
            }
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
            // Restaurar rail mode
            const savedRailMode = localStorage.getItem('railMode')
            if (savedRailMode !== null) {
                this.isRailMode = savedRailMode === 'true'
            }

            // Restaurar drawer state
            const savedDrawer = localStorage.getItem('drawerOpen')
            if (savedDrawer !== null) {
                this.drawer = savedDrawer === 'true'
            }
        }
    },

    beforeUnmount() {
        // Limpiar listener
        window.removeEventListener('resize', this.checkMobile)
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
</style>