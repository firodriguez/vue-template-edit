<!-- src/views/NotFound.vue -->
<template>
    <v-container fluid class="pa-6">
        <div class="text-center">
            <v-icon size="120" color="grey">mdi-file-question</v-icon>
            <h1 class="text-h2 font-weight-bold mb-4">404</h1>
            <h2 class="text-h4 mb-4">Página no encontrada</h2>
            <p class="text-body-1 mb-6">La página que buscas no existe o ha sido movida.</p>
            <v-btn color="primary" :to="{ name: 'dashboard' }" size="large">
                <v-icon left>mdi-home</v-icon>
                Volver al Dashboard
            </v-btn>
        </div>
    </v-container>
</template>

<script>
export default {
    name: 'NotFound'
}
</script>