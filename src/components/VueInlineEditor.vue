<template>
<div class="vue-inline-editor"
     ref="vueInlineEditor">
    <div class="vie-editor-content" 
         contenteditable="true"
         @keyup="handleKeyup" 
         @mouseup="handleMouseup"
         ref="editContent">
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import Toolbar from './toolbar/Index.vue';
import '../styles/normalize.css';
import '../styles/icon-font/iconfont.css';

export default {
    name: 'VueInlineEditor',
    props: {
        value: {
            type: String,
            required: true
        },
        options: {
            type: Object
        }
    },
    components: {
        Toolbar
    },
    data () {
        return {
            currentValue: this.value,
            editContent: null,
            toolbar: null
        };
    },
    methods: {
        setCurrentVal (value) {
            this.$emit('input', value);
            this.$emit('change', value);
            this.currentValue = value;
        },
        execCommand ({name, value}) {
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
        getSelection () {
            if (document.getSelection) {
                return document.getSelection();
            }
        },
        getRange () {
            let sel = this.getSelection();
            let range;
            if (sel && sel.rangeCount !== 0) {
                range = sel.getRangeAt(0);
            }
            return range;
        },
        fontSize (name, value) {
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
                            attr.nodeName === 'size' ? span.style.fontSize = value : span.setAttribute(attr.nodeName, attr.nodeValue);
                        });
                        span.innerHTML = font.innerHTML;
                        span.querySelectorAll('span').length !== 0 && this.formatContent(span, 'span', 'fontSize');
                        span.normalize();
                        font.parentNode.replaceChild(span, font);
                        spanList.push(span);
                        i--;
                    }
                    range.setStartBefore(spanList[0]);
                    range.setEndAfter(spanList[spanList.length - 1]);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        },
        showToolbar () {
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
        hideToolbar () {
            this.toolbar.$el.style.top = '-9999px';
        },
        handleKeyup (event) {
            const value = event.target.innerHTML;
            this.toolbar.$el.style.top = '-9999px';
            this.setCurrentVal(value);
        },
        handleMouseup () {
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
        updateButtonState () {
            const buttons = this.toolbar.buttons;
            const selects = this.toolbar.selects;
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

            for (let button in buttons) {
                if (buttons[button].hasOwnProperty('active')) {
                    buttons[button].active = state['is_' + button] === 'true';
                }
            }

            const fontName = d.queryCommandValue('fontName');
            selects.fontName.value = fontName.split(',')[0] || '';

            selects.fontSize.value = this.updateFontSize() || '';
        },
        getFontSize (element) {
            if (element.nodeType === 3) {
                element = element.parentNode;
            }
            var value = element.style['fontSize'] || this.getWindow(element).getComputedStyle(element, '').getPropertyValue('font-size');

            return value;
        },
        getWindow (node) {
            var doc = node.ownerDocument || node;
            return doc.defaultView || doc.parentWindow;
        },
        updateFontSize () {
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
        bindClickEvent (event) {
            var isClickToolbar = event.path.includes(this.toolbar.$el);
            var isClickContent = event.path.includes(this.editContent);
            if (!isClickToolbar && !isClickContent) {
                this.hideToolbar();
            }
        },
        initToolbar () {
            const Instant = new Vue(Toolbar);
            Instant.$on('execCommand', this.execCommand);
            Instant.$data.options = this.options;

            const toolbar = Instant.$mount();
            document.body.appendChild(toolbar.$el);
            this.toolbar = toolbar;
        }
    },
    mounted () {
        this.editContent = this.$refs.editContent;
        this.editContent.innerHTML = this.value;

        this.initToolbar();

        document.addEventListener('click', this.bindClickEvent);
    },
    beforeDestroy () {
        this.toolbar.$el.remove();
    },
    destroyed () {
        document.removeEventListener('click', this.bindClickEvent);
    }
};
</script>

<style lang="scss" scoped>
.vue-inline-editor {
    position: relative;
    width: 100%;
    height: 100%;

    .vie-editor-content {
        width: 100%;
        height: 100%;
        outline: 0;
    }
}
</style>
