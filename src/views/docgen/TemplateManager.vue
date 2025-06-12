<!-- src/views/docgen/TemplateManager.vue -->
<template>
    <v-container fluid class="pa-6">
        <div class="d-flex align-center mb-6">
            <v-icon size="40" color="blue" class="mr-3">mdi-folder-multiple</v-icon>
            <div>
                <h1 class="text-h4 font-weight-bold">Gestión de Templates</h1>
                <p class="text-subtitle-1 text-grey-darken-1 mb-0">
                    Administra y organiza tus templates
                </p>
            </div>
        </div>

        <v-alert type="info" variant="tonal" class="mb-6">
            Esta vista será expandida con funcionalidades de gestión avanzada
        </v-alert>

        <v-card elevation="2">
            <v-card-title class="bg-blue text-white">
                <v-icon left>mdi-file-document-edit</v-icon>
                Lista de Templates
            </v-card-title>
            <v-card-text class="pa-6">
                <p>Aquí se mostrará la lista completa de templates con opciones de:</p>
                <ul class="ml-4">
                    <li>Búsqueda y filtrado</li>
                    <li>Organización por categorías</li>
                    <li>Duplicación de templates</li>
                    <li>Historial de cambios</li>
                </ul>

                <div class="mt-4">
                    <v-btn color="primary" :to="{ name: 'docgen-editor' }">
                        <v-icon left>mdi-plus</v-icon>
                        Crear Nuevo Template
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default {
    name: 'TemplateManager'
}
</script>
