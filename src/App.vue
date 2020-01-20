<template>
  <div id="app">
    <section class="page-header">
      <h1 class="project-name">
        v-inline-editor
      </h1>
      <h2 class="project-tagline">
        A WYSIWYG editor of inline mode.
      </h2>
      <a href="https://github.com/xushaocong/v-inline-editor" class="btn">View on GitHub</a>
    </section>
    <section class="page-main">
      <vue-inline-editor v-model="content" :pastePlain="pastePlain"></vue-inline-editor>
    </section>
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
      content: '请选中文本进行编辑',
      pastePlain: true
    }
  }
}
</script>

<style lang="scss">
html {
  font-size: 16px;
}
.page-header {
  padding: 5rem 6rem;
  color: #fff;
  text-align: center;
  background-color: #159957;
  background-image: linear-gradient(120deg, #155799, #159957);

  .project-name {
    font-size: 3.25rem;
    margin-bottom: 0.1rem;
  }
  
  .project-tagline {
    font-size: 1.25rem;
    font-weight: normal;
    margin-bottom: 2rem;
    opacity: 0.7;
  }

  .btn {
    display: inline-block;
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    color: rgba(255,255,255,0.7);
    background-color: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.2);
    border-style: solid;
    border-width: 1px;
    border-radius: 0.3rem;
    text-decoration: none;
    transition: color 0.2s, background-color 0.2s, border-color 0.2s;
  }
}

.page-main {
  padding: 5rem 10rem;
}
</style>
