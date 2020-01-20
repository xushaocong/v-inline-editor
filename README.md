# v-inline-editor

> A WYSIWYG editor of inline mode. 

Online [Demo](https://xushaocong.github.io/v-inline-editor/)

### Install

```js
yarn add v-inline-editor
```

### Usage
```js
import Vue from 'vue';
import VueInlineEditor from 'v-inline-editor';
import 'v-inline-editor/lib/v-inline-editor.css';

Vue.use(VueInlineEditor);

// or

import VueInlineEditor from 'v-inline-editor';
import 'v-inline-editor/lib/v-inline-editor.css';
Vue.component(VueInlineEditor.name, VueInlineEditor);
```
```vue
<template>
    <vue-inline-editor v-model="text"
        :options="customOptions"
        :pastePlain="pastePlain">
    </vue-inline-editor>
</template>

<script>
export default {
    data() {
        return {
            text: '请输入文本信息',
            pastePlain: false,
            customOptions: {
                toolbar: ['fontSize', 'fontName', 'bold'],
                fontSize: [
                    { value: '16px', label: '16px' },
                    { value: '18px', label: '18px' },
                    { value: '20px', label: '20px' }
                ],
                fontName: [
                    { value: '微软雅黑', label: '微软雅黑' },
                    { value: '宋体', label: '宋体' }
                ]
            }
        }
    }
}
</script>
```

### Component Options

参数 | 说明 | 类型 | 可选值 | 默认值
---  | ---  |  --- |   ---  |  ---
value/v-model | 绑定值 | string | - | -
options | 组件参数配置（详见下文） | Object | - | -
pastePlain | 复制纯文本 | Boolean | - | false

options 参数是一个对象，对象里包含 3 个属性，分别是 `toolbar` `fontName` `fontSize`。

```js
// toolbar 类型为 Array[]，可选填部分功能按钮，默认值为：

toolbar: [
    'fontName', 'fontSize',
    'foreColor', 'backColor',
    'bold', 'italic', 'underline', 'strikeThrough',
    'superscript', 'subscript',
    'justifyLeft', 'justifyCenter', 'justifyRight',
    'removeFormat'
]

// fontSize 类型为 Array[]，数组元素为对象，默认值为：

fontSize: [
    { value: '12px', label: '12px' },
    { value: '14px', label: '14px' },
    { value: '16px', label: '16px' },
    { value: '18px', label: '18px' },
    { value: '20px', label: '20px' },
    { value: '24px', label: '24px' },
    { value: '28px', label: '28px' },
    { value: '32px', label: '32px' },
    { value: '48px', label: '48px' }
 ]

// fontName 类型为 Array[]，数组元素为对象，默认值为：

fontName: [
    { value: '微软雅黑', label: '微软雅黑' },
    { value: '宋体', label: '宋体' },
    { value: '仿宋', label: '仿宋' },
    { value: 'serif', label: 'Serif' },
    { value: 'Helvetica', label: 'Helvetica' }
 ]
```

### Component Events
事件名称 | 说明 | 回调参数 
---  | ---  |  --- 
input | 当输入框内容发生变化时触发 | 输入框内容

### Development
```js
// install dependencies
yarn install

// compiles and hot-reloads for development
yarn run serve
```
