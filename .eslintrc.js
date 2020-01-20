
module.exports = {
  "root": true,
  "env": {
    "node": true
  },
  "extends": [
    "plugin:vue/essential",
    "eslint:recommended"
  ],
  "parserOptions": {
    "parser": "babel-eslint"
  },
  "rules": {
    'no-param-reassign': 'off',
    'prefer-destructuring': 'off',

    // ========================== style rules =============================
    'max-len': [
      'error',
      150,
      2,
      {
        ignoreUrls: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'one-var': 'off', // off to allow mutiple var delcaration statements
    'react/jsx-filename-extension': 'off', // off to allow jsx in .js
    'vars-on-top': 'off', // off to allow define vars in the middle of the body

    // ========================== syntax rules =============================
    'guard-for-in': 'off',
    'handle-callback-err': ['error', '^(err|error)$'],
    "indent": ["error", 2, {"SwitchCase": 1}],
    'no-alert': process.env.NODE_ENV === 'production' ? 2 : 0, // allow debugger during development
    'no-bitwise': 'off', // off to allow binary ops
    'no-console': 'error',
    'no-continue': 'off', // off to allow continue
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0, // allow debugger during development
    'no-else-return': 'off', // off to allow `else return;`
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-mixed-operators': 'off', // off to allow a + b / c
    'no-nested-ternary': 'off', // off to allow multiple conditional statement like a? b: c? d: e
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }], // allow ++ in for, but error in otherwhere
    'no-prototype-builtins': 'off', // off to allow `obj.hasOwnProperty(prop)`
    'no-restricted-syntax': ['error',
      { selector: 'ForInStatement', message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.' },
      // { selector: 'ForOfStatement', message: 'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.' },
      { selector: 'LabeledStatement', message: 'Labels are a form ofGOTO; using them makes code confusing and hard to maintain and understand.' },
      { selector: 'WithStatement', message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.' }], // not allow with()/label:
    'no-shadow': ['error', {
      // builtinGlobals: true,
      hoist: 'functions',
      allow: ['err'],
    }],
    'no-return-assign': ['error', 'except-parens'],
    'no-underscore-dangle': ['error', { allowAfterThis: true }], // error to call instance._prop, but allow this._prop
    'no-unused-expressions': ['error', { allowShortCircuit: true }], // allow fn && fn();
    'no-use-before-define': ['error', {
      functions: false,
      classes: true,
    }],
    'no-useless-call': 'error',
    // 'promise/always-return': 'error',
    // 'promise/catch-or-return': 'error',
    'promise/no-native': 'off',
    'promise/param-names': 'off',
    'react/jsx-space-before-closing': 'off', // off for deprecated by react/jsx-tag-spacing
    'react/prefer-es6-class': 'off',

    // 计算属性必须有返回值
    // "vue/return-in-computed-property": 'off',
    // prop 必须有类型限制
    'vue/require-prop-types': 'off',
    // "vue/no-unused-components": 'off',
    // 禁止在计算属性中对属性修改
    // "vue/no-side-effects-in-computed-properties": 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    // "vue/no-template-shadow": 'off',
    // 'vue/html-end-tags': 'off',
    // 没有内容时，组件必须自闭和
    // 'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-closing-bracket-newline': ['error', {
      multiline: 'never',
    }],
    'vue/require-default-prop': 'off',
    // "vue/this-in-template": 'off',
    'vue/no-v-html': 'off',
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: false,
      ignores: [],
    }],
    'vue/singleline-html-element-content-newline': ['error', {
      ignoreWhenNoAttributes: true,
      ignoreWhenEmpty: true,
      ignores: [
        'pre', 'textarea', 'a', 'abbr', 'audio', 'b', 'bdi', 'bdo', 'canvas', 'cite', 'code', 'data', 'del', 'dfn', 'em', 'i', 'iframe', 'ins', 'kbd', 'label', 'map', 'mark', 'noscript', 'object', 'output', 'picture', 'q', 'ruby', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'time', 'u', 'var', 'video',
        'e-text', 'EText',
      ],
    }],
    'vue/multiline-html-element-content-newline': ['error', {
      ignores: ['VueComponent', 'pre', 'textarea', 'EText'],
    }],
  },
}
