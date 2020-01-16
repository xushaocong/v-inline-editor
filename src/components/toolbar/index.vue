<template>
  <div
    ref="toolbar"
    class="vie-toolbar"
    style="top: -9999px;">
    <template v-for="(item, index) in toolbar">
      <button
        v-if="item in buttons"
        :class="{active: buttons[item].active}"
        :title="buttons[item].title"
        :key="index"
        unselectable="on"
        class="button"
        @click.stop="btnHandler($event, item)">
        <!-- <i :class="'iconfont icon-' + [buttons[item].className]"/> -->
        <svg
          class="icon"
          aria-hidden="true">
          <use :xlink:href="'#icon-' + [buttons[item].className]" />
        </svg>
      </button>
      <select
        v-else-if="item in selects"
        v-model="selects[item].value"
        :key="index"
        unselectable="on"
        class="select"
        @change="selectHandler($event, item)">
        <option
          v-for="(op, i) in config[item]"
          :key="i"
          :value="op.value">
          {{ op.label }}
        </option>
      </select>
      <color-picker
        v-else-if="item in colorPickers"
        :key="index"
        :title="colorPickers[item].title"
        v-model="colorPickers[item].value"
        unselectable="on"
        @change="colorPickerHandle($event, item)">
        <!-- <i
          slot="icon"
          :class="'iconfont icon-' + [colorPickers[item].className]"/> -->
        <svg
          slot="icon"
          class="icon"
          aria-hidden="true">
          <use :xlink:href="'#icon-' + [colorPickers[item].className]" />
        </svg>
      </color-picker>
    </template>
  </div>
</template>
<script>
import { getToolbar } from '../../config/toolbar.js';
import { getConfig } from '../../config/vie-config.js';
import ColorPicker from '../toolbar/ColorPicker';
export default {
  name: 'VieToolbar',
  components: {
    ColorPicker
  },
  props: {},
  data() {
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
  mounted() {
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
  },
  methods: {
    btnHandler(evt, button) {
      let btn = this.buttons[button];
      if (btn.action) {
        if (btn.native) {
          this.$emit('execCommand', { name: button, value: null });
        } else {
          // this.$store.dispatch('callMethod', { name: button, params: null })
          // this.updateStates(button)
        }
      }
    },
    selectHandler(evt, select) {
      this.$emit('execCommand', { name: select, value: this.selects[select].value });
    },
    colorPickerHandle(color, cp) {
      this.$emit('execCommand', { name: cp, value: color });
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
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    box-sizing: content-box;
    overflow: hidden;
    fill: currentColor;
  }
}
</style>
