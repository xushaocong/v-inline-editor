<template>
  <div
    ref="vueInlineEditor"
    class="vue-inline-editor">
    <div
      ref="editContent"
      class="vie-editor-content"
      contenteditable="true"
      @keyup="handleKeyup"
      @paste.stop="handlePaste"
      @mouseup="handleMouseup"/>
  </div>
</template>

<script>
import Vue from 'vue';
import Toolbar from '../toolbar';
import '../../assets/css/index.scss';
import '../../assets/css/icon-font/iconfont.js';

export default {
  name: 'VueInlineEditor',
  props: {
    value: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: null
    },
    pastePlain: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: this.value,
      editContent: null,
      toolbar: null
    };
  },
  mounted() {
    this.editContent = this.$refs.editContent;
    this.editContent.innerHTML = this.value;

    this.initToolbar();

    document.addEventListener('click', this.bindClickEvent);
  },
  beforeDestroy() {
    this.toolbar.$el.remove();
  },
  destroyed() {
    document.removeEventListener('click', this.bindClickEvent);
  },
  methods: {
    setCurrentVal(value) {
      this.$emit('input', value);
      this.$emit('change', value);
      this.currentValue = value;
    },
    execCommand({name, value}) {
      if (this[name]) {
        this[name](name, value);
      } else {
        let sel = this.getSelection();
        let range = this.getRange();
        if (!sel || !range) return;
        if (document.queryCommandSupported('styleWithCss')) {
          document.execCommand('styleWithCss', false, true);
        }
        document.execCommand(name, false, value);
      }
      this.updateButtonState();

      const contentText = this.editContent.innerHTML;
      this.setCurrentVal(contentText);
    },
    getSelection() {
      if (document.getSelection) {
        return document.getSelection();
      }
    },
    getRange() {
      let sel = this.getSelection();
      let range;
      if (sel && sel.rangeCount !== 0) {
        range = sel.getRangeAt(0);
      }
      return range;
    },
    fontSize(name, value) {
      let selection = this.getSelection();
      let range = this.getRange();
      if (!selection || !range || range.collapsed) {
        return;
      }
      let childNodes = range.cloneContents().childNodes;
      if (childNodes.length === 1 && childNodes[0].nodeType === 1 && childNodes[0].tagName.toLowerCase() === 'span') {
        let span = range.extractContents().childNodes[0];
        span.style.fontSize = value;
        range.insertNode(span);
        range.selectNode(span);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        if (navigator.userAgent.indexOf('Chrome') !== -1 && navigator.userAgent.indexOf('Edge') === -1) {
          if (document.queryCommandSupported('styleWithCss')) {
            document.execCommand('styleWithCss', false, true);
          }
          document.execCommand('fontSize', false, 7);
          let container = range.commonAncestorContainer;
          container.nodeType === 3 && (container = container.parentNode);
          container.tagName.toLowerCase() === 'span' && (container = container.parentNode);
          Array.prototype.forEach.call(container.getElementsByTagName('span'), function (span) {
            if (span.style.fontSize.trim() === '-webkit-xxx-large' || span.style.fontSize.trim() === 'xx-large') {
              span.style.fontSize = value;
            }
            span.normalize();
          });
        } else {
          if (document.queryCommandSupported('styleWithCss')) {
            document.execCommand('styleWithCss', false, false);
          }
          document.execCommand('fontSize', false, 7);

          let fontList = [];
          let spanList = [];
          let container = range.commonAncestorContainer;
          container.nodeType === 3 && (container = container.parentNode);
          container.tagName.toLowerCase() === 'font' && (container = container.parentNode);
          fontList = container.getElementsByTagName('font');
          for (let i = 0; i < fontList.length; i++) {
            let font = fontList[i];
            let span = document.createElement('span');
            Array.prototype.forEach.call(font.attributes, function (attr) {
              // eslint-disable-next-line no-unused-expressions
              attr.nodeName === 'size' ? span.style.fontSize = value : span.setAttribute(attr.nodeName, attr.nodeValue);
            });
            span.innerHTML = font.innerHTML;
            span.querySelectorAll('span').length !== 0 && this.formatContent(span, 'span', 'fontSize');
            span.normalize();
            font.parentNode.replaceChild(span, font);
            spanList.push(span);
            // eslint-disable-next-line no-plusplus
            i--;
          }
          range.setStartBefore(spanList[0]);
          range.setEndAfter(spanList[spanList.length - 1]);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    },
    showToolbar() {
      let selection = window.getSelection();
      let range = selection.getRangeAt(0);
      let toolbar = this.toolbar.$el;
      let limit = 2;
      let limitR = (window.innerWidth - toolbar.clientWidth) - 2;
      let boundary = range.getBoundingClientRect();

      let left = (((boundary.right - boundary.left) / 2) + boundary.left) - (toolbar.clientWidth / 2);
      let top = boundary.top - (toolbar.clientHeight + 8) + window.pageYOffset;

      left = left < limit ? limit : left > limitR ? limitR : left;

      toolbar.style.top = top + 'px';
      toolbar.style.left = left + 'px';
    },
    hideToolbar() {
      this.toolbar.$el.style.top = '-9999px';
    },
    handleKeyup(event) {
      const value = event.target.innerHTML;
      this.toolbar.$el.style.top = '-9999px';
      this.setCurrentVal(value);
    },
    handleMouseup() {
      setTimeout(() => {
        let selection = window.getSelection();
        if (selection.isCollapsed) {
          this.hideToolbar();
        } else {
          this.updateButtonState();
          this.showToolbar();
        }
      }, 1);
    },
    handlePaste(event) {
      if (this.pastePlain) {
        event.preventDefault();
        let text = (event.clipboardData || window.clipboardData).getData('text/plain');
        if (document.queryCommandSupported('insertText')) {
          document.execCommand('insertText', false, text);
        } else {
          document.execCommand('paste', false, text);
        }
      }
    },
    rgbToHex(rgb) {
      let regExp = /\((.+)\)/;
      let result = rgb.match(regExp);
      if (result) {
        result = result[1].split(',');
        let r = parseInt(result[0].trim());
        let g = parseInt(result[1].trim());
        let b = parseInt(result[2].trim());
        let hex = ((r << 16) | (g << 8) | b).toString(16);
        return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
      }
      return '';
    },
    updateButtonState() {
      const buttons = this.toolbar.buttons;
      const selects = this.toolbar.selects;
      const colorPickers = this.toolbar.colorPickers;
      const d = document;
      const state = {
        'is_bold': d.queryCommandValue('bold'),
        'is_italic': d.queryCommandValue('italic'),
        'is_underline': d.queryCommandValue('underline'),
        'is_strikeThrough': d.queryCommandValue('strikeThrough'),
        'is_superscript': d.queryCommandValue('superscript'),
        'is_subscript': d.queryCommandValue('subscript'),
        'is_justifyLeft': d.queryCommandValue('justifyLeft'),
        'is_justifyCenter': d.queryCommandValue('justifyCenter'),
        'is_justifyRight': d.queryCommandValue('justifyRight')
      };

      // eslint-disable-next-line no-restricted-syntax
      for (let button in buttons) {
        if (buttons[button].hasOwnProperty('active')) {
          buttons[button].active = state['is_' + button] === 'true';
        }
      }

      const fontName = d.queryCommandValue('fontName');
      selects.fontName.value = fontName.split(',')[0] || '';
      selects.fontSize.value = this.updateFontSize() || '';

      const foreColor = d.queryCommandValue('foreColor');
      const backColor = d.queryCommandValue('backColor');
      colorPickers.foreColor.value = this.rgbToHex(foreColor) || '';
      colorPickers.backColor.value = this.rgbToHex(backColor) || '';
    },
    getFontSize(element) {
      if (element.nodeType === 3) {
        element = element.parentNode;
      }
      var value = element.style['fontSize'] || this.getWindow(element).getComputedStyle(element, '').getPropertyValue('font-size');

      return value;
    },
    getWindow(node) {
      var doc = node.ownerDocument || node;
      return doc.defaultView || doc.parentWindow;
    },
    updateFontSize() {
      let selection = window.getSelection();
      let range = selection.getRangeAt(0);
      let element = range.startContainer;
      var styleVal = this.getFontSize(element);
      var tmp = /^([\d]+)(\w+)$/.exec(styleVal);

      if (tmp) {
        return Math.floor(tmp[1]) + tmp[2];
      }
      return styleVal;
    },
    bindClickEvent(event) {
      var isClickToolbar = event.path.includes(this.toolbar.$el);
      var isClickContent = event.path.includes(this.editContent);
      if (!isClickToolbar && !isClickContent) {
        this.hideToolbar();
      }
    },
    initToolbar() {
      const Instant = new Vue(Toolbar);
      Instant.$on('execCommand', this.execCommand);
      Instant.$data.options = this.options;

      const toolbar = Instant.$mount();
      document.body.appendChild(toolbar.$el);
      this.toolbar = toolbar;
    }
  }
};
</script>

<style lang="scss">
.vue-inline-editor {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;

    .vie-editor-content {
        width: 100%;
        height: 100%;
        outline: 0;
    }
}
</style>
