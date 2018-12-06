<template>
<div class="vie-toolbar" ref="toolbar" style="top: -9999px;">
    <template v-for="(item, index) in toolbar">
        <button
            v-if="item in buttons"
            unselectable="on"
            class="button"
            :class="{active: buttons[item].active}"
            :title="buttons[item].title"
            :key="index"
            @click.stop="btnHandler($event, item)">
            <i :class="'iconfont icon-' + [buttons[item].className]"></i>
        </button>
        <select
            v-else-if="item in selects"
            v-model="selects[item].value"
            unselectable="on"
            class="select"
            :key="index"
            @change="selectHandler($event, item)">
            <option v-for="(op, i) in config[item]" :key="i" :value="op.value">{{ op.label }}</option>
        </select>
        <color-picker 
            v-else-if="item in colorPickers" 
            :key="index"
            unselectable="on"
            :title="colorPickers[item].title"
            v-model="colorPickers[item].value" 
            @change="colorPickerHandle($event, item)">
            <i slot="icon" :class="'iconfont icon-' + [colorPickers[item].className]"></i>
        </color-picker>
    </template>
</div>
</template>
<script>
import { getToolbar } from '../../config/toolbar.js';
import { getConfig } from '../../config/index.js';
import ColorPicker from './ColorPicker';
export default {
    name: 'Toolbar',
    props: {},
    data () {
        let { buttons, selects, colorPickers } = getToolbar();
        return {
            options: null,
            buttons,
            selects,
            colorPickers,
            config: getConfig(),
            toolbar: getConfig('toolbar')
        };
    },
    components: {
        ColorPicker
    },
    methods: {
        btnHandler (evt, name) {
            let btn = this.buttons[name];
            if (btn.action) {
                if (btn.native) {
                    this.$emit('execCommand', { name: name, value: null });
                } else {
                    // this.$store.dispatch('callMethod', { name: name, params: null })
                    // this.updateStates(name)
                }
            }
        },
        selectHandler (evt, name) {
            this.$emit('execCommand', { name: name, value: this.selects[name].value });
        },
        colorPickerHandle (color, name) {
            this.$emit('execCommand', { name: name, value: color });
        }
    },
    mounted () {
        if (this.options) {
            if (this.options.toolbar) {
                this.toolbar = this.options.toolbar;
                this.config.toolbar = this.options.toolbar;
            }
            if (this.options.fontSize) {
                this.config.fontSize = this.options.fontSize;
            }
            if (this.options.fontName) {
                this.config.fontName = this.options.fontName;
            }
        }
    }
};
</script>
<style lang="scss">
.vie-toolbar {
    display: inline-block;
    position: absolute;
    width: auto;
    height: 40px;
    background-color: #545454;
    padding: 3px;
    border-radius: 5px;
    z-index: 999;

    .select {
        display: inline-block;
        position: relative;
        min-width: 80px;
        height: 32px;
        margin: 0 2px;
        font-size: 14px;
        color: #fff;
        background-color: #5f5f5f;
        border: 1px solid #454545;
        border-radius: 4px;
        outline: none;
    }
    .button {
        display: inline-block;
        width: 28px;
        height: 32px;
        margin: 0 2px;
        color: #8a8a8a;
        border: 1px solid transparent;
        border-radius: 4px;
        background-color: inherit;
        cursor: pointer;
        outline: none;

        &:hover {
            border-color: #999;
            color: #fff;
        }
        &.active {
            border-color: #999;
        }
    }
}
</style>
