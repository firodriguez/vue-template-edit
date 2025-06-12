<template>
  <TemplateEditor />
</template>

<script>
import TemplateEditor from './components/TemplateEditor.vue'

export default {
  name: 'App',
  components: {
    TemplateEditor
  }
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100vh;
}
</style>