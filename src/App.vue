<template>
    <div id="app">
        <router-view/>
        <button @click="show = true">show</button><button @click="show = false">remove</button>
        <div class="editor">
            <vue-inline-editor v-model="content" v-if="show"></vue-inline-editor>
        </div>
    </div>
</template>

<script>
import VueInlineEditor from './components/VueInlineEditor';
export default {
    name: 'app',
    components: {
        VueInlineEditor
    },
    data () {
        return {
            content: '<p>sdsdd555</p>',
            show: true,
            options: {
                toolbar: ['fontName', 'fontSize', 'foreColor', 'backColor'],
                fontSize: [
                    { label: '0.5rem', value: '0.5rem' }
                ],
                fontName: [
                    { label: '黑体', value: '黑体' }
                ]
            }
        };
    }
};
</script>

<style>
#app {
    font-family: '微软雅黑', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.editor {
    width: 200px;
    height: 300px;
    margin: 380px 600px;
}
</style>
