<!-- src/views/Help.vue -->
<template>
    <v-container fluid class="pa-6">
        <div class="d-flex align-center mb-6">
            <v-icon size="40" color="orange" class="mr-3">mdi-help-circle</v-icon>
            <div>
                <h1 class="text-h4 font-weight-bold">Ayuda</h1>
                <p class="text-subtitle-1 text-grey-darken-1 mb-0">
                    Documentación y soporte
                </p>
            </div>
        </div>

        <v-alert type="info" variant="tonal" class="mb-6">
            Documentación y sistema de ayuda en desarrollo
        </v-alert>
    </v-container>
</template>

<script>
export default {
    name: 'Help'
}
</script>