import VueInlineEditor from './components/vue-inline-editor';

VueInlineEditor.install = function (Vue) {
  Vue.component(VueInlineEditor.name, VueInlineEditor);
};

export default VueInlineEditor;
