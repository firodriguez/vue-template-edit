<!-- src/views/docgen/DocGenDashboard.vue -->
<template>
    <v-container fluid class="pa-6">
        <div class="d-flex align-center mb-6">
            <v-icon size="40" color="purple" class="mr-3">mdi-chart-line</v-icon>
            <div>
                <h1 class="text-h4 font-weight-bold">Dashboard DocGen</h1>
                <p class="text-subtitle-1 text-grey-darken-1 mb-0">
                    Estadísticas y métricas del servicio DocGen
                </p>
            </div>
        </div>

        <v-alert type="info" variant="tonal" class="mb-6">
            Esta vista será expandida con métricas específicas del servicio DocGen
        </v-alert>

        <v-row>
            <v-col cols="12" md="6">
                <v-card elevation="2">
                    <v-card-title class="bg-purple text-white">
                        <v-icon left>mdi-file-document-multiple</v-icon>
                        Templates Overview
                    </v-card-title>
                    <v-card-text class="pa-6">
                        <p>Resumen de templates disponibles y su uso.</p>
                        <v-btn color="primary" :to="{ name: 'docgen-manager' }">
                            Ver Gestión de Templates
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card elevation="2">
                    <v-card-title class="bg-purple text-white">
                        <v-icon left>mdi-file-pdf</v-icon>
                        Generación de PDFs
                    </v-card-title>
                    <v-card-text class="pa-6">
                        <p>Estadísticas de generación de documentos.</p>
                        <v-btn color="primary" :to="{ name: 'docgen-editor' }">
                            Ir al Editor
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'DocGenDashboard'
}
</script>
