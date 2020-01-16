<template>
  <div id="app">
    <vue-inline-editor v-model="content" :pastePlain="pastePlainTxt"></vue-inline-editor>
  </div>
</template>

<script>
import VueInlineEditor from './components/vue-inline-editor';
export default {
  name: 'App',
  components: {
    VueInlineEditor
  },
  data() {
    return {
      content: '请选择文本进行编辑',
      pastePlainTxt: true
    }
  }
}
</script>

<style>
#app {
  margin: 80px;
}
</style>
