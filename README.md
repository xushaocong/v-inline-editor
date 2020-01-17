# v-inline-editor

> A WYSIWYG editor of inline mode.  

### Install

```js
yarn add v-inline-editor
```

### Usage
```js
import Vue from 'vue';
import VueInlineEditor from 'v-inline-editor';

Vue.use(VueInlineEditor);

// or

import VueInlineEditor from 'v-inline-editor';
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
            options: {
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
options | 组件参数配置（详见下表） | Object | - | -
pastePlain | 复制纯文本 | Boolean | - | false

#### Options Attribute
属性 | 说明 | 类型 | 可选值 | 默认值
---  | ---  |  --- |   ---  |  ---
toolbar | 控制工具条的功能 | Array | - | ['fontName', 'fontSize', 'foreColor', 'backColor', 'bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript', 'justifyLeft', 'justifyCenter', 'justifyRight', 'removeFormat']
fontSize | 控制 fontSize 下拉选择框的 option | Array | - | -
fontName | 控制 fontName 下拉选择框的 option | Array | - | -



### Development
```js
// install dependencies
yarn install

// compiles and hot-reloads for development
yarn run serve
```
