<!-- src/views/Settings.vue -->
<template>
    <v-container fluid class="pa-6">
        <div class="d-flex align-center mb-6">
            <v-icon size="40" color="grey-darken-1" class="mr-3">mdi-cog</v-icon>
            <div>
                <h1 class="text-h4 font-weight-bold">Configuración</h1>
                <p class="text-subtitle-1 text-grey-darken-1 mb-0">
                    Personaliza tu experiencia en la plataforma
                </p>
            </div>
        </div>

        <v-alert type="info" variant="tonal" class="mb-6">
            <v-icon left>mdi-information</v-icon>
            Panel de configuración en desarrollo
        </v-alert>
    </v-container>
</template>

<script>
export default {
    name: 'Settings'
}
</script>
