import VueInlineEditor from './components/VueInlineEditor.vue';

VueInlineEditor.install = function (Vue) {
    Vue.component(VueInlineEditor.name, VueInlineEditor);
};

export default VueInlineEditor;
