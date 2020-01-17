const resolve = require('rollup-plugin-node-resolve');
const vue = require('rollup-plugin-vue');
const commonjs = require('rollup-plugin-commonjs');
const buble = require('rollup-plugin-buble');
const scss = require('rollup-plugin-scss');
const { terser } = require('rollup-plugin-terser');

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/vue-inline-editor.js',
    name: 'VueInlineEditor',
    format: 'umd',
    globals: {
      vue: 'Vue'
    }
  },
  external: [ 'vue' ],
  plugins: [
    resolve({
      extensions: ['.js', '.css', '.scss', '.vue']
    }),
    commonjs(),
    vue({
      compileTemplate: true,
      css: false
    }),
    scss(),
    buble(),
    terser()
  ]
};
